import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Products } from './products.model';
import { IProducts } from './products.interface';
import { ProductsValidation } from './products.validation';
import unlinkFile from '../../../shared/unlinkFile';

interface ProductDetail {
  name: string;
  value: string;
}

const createProducts = async (payload: IProducts): Promise<IProducts> => {
  try {
    // Parse details from JSON string
    if (typeof payload.details === 'string') {
      payload.details = JSON.parse(payload.details);
    }

    // Validate the payload first
    await ProductsValidation.createProductsZodSchema.parseAsync({
      ...payload,
      price: String(payload.price),
      discountedPrice: String(payload.discountedPrice),
      stockAmount: String(payload.stockAmount),
      details: payload.details,
    });

    // Convert strings back to numbers for database
    const numericPayload = {
      ...payload,
      price: Number(payload.price),
      discountedPrice: Number(payload.discountedPrice),
      stockAmount: Number(payload.stockAmount),
      details: Array.isArray(payload.details)
        ? payload.details
        : JSON.parse(payload.details),
    };

    const result = await Products.create(numericPayload);
    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create product!');
    }
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid details format');
    }
    throw error;
  }
};

interface IProductQueryFields {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const getAllProductss = async (
  queryFields: IProductQueryFields
): Promise<{
  products: IProducts[];
  totalProducts: number;
  totalPages: number;
}> => {
  const {
    search,
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    sortBy = 'createdAt',
    sortOrder = 'asc',
  } = queryFields;

  // Build the query object with multiple filtering options
  const query: Record<string, any> = {};

  // Text search across title and description
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = minPrice;
    if (maxPrice !== undefined) query.price.$lte = maxPrice;
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Sorting
  const sortOptions: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  try {
    // Fetch products with pagination, sorting, and filtering
    const [products, totalProducts] = await Promise.all([
      Products.find(query).sort(sortOptions).skip(skip).limit(limit).lean(), // Use lean for better performance
      Products.countDocuments(query),
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      totalProducts,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to retrieve products');
  }
};

const getProductsById = async (id: string): Promise<IProducts | null> => {
  const result = await Products.findById(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Products not found!');
  }
  return result;
};

const updateProducts = async (
  id: string,
  payload: Partial<IProducts>
): Promise<IProducts | null> => {
  console.log('Payload :', payload);

  try {
    // Handle details parsing and ensure it's an array
    let parsedDetails = payload.details;
    if (typeof payload.details === 'string') {
      try {
        parsedDetails = JSON.parse(payload.details);
      } catch (error) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid details format');
      }
    }

    // Handle image array
    let imageArray = payload.image;
    if (typeof payload.image === 'string') {
      try {
        imageArray = JSON.parse(payload.image);
      } catch (error) {
        // If it's not JSON, treat it as a single image
        imageArray = [payload.image];
      }
    }

    // Ensure details is always an array if provided
    if (parsedDetails !== undefined && !Array.isArray(parsedDetails)) {
      parsedDetails = [parsedDetails];
    }

    // Convert string numbers to actual numbers if present
    const numericPayload = {
      ...payload,
      ...(payload.price !== undefined && { price: Number(payload.price) }),
      ...(parsedDetails !== undefined && { details: parsedDetails }),
      ...(payload.discountedPrice !== undefined && {
        discountedPrice: Number(payload.discountedPrice),
      }),
      ...(payload.stockAmount !== undefined && {
        stockAmount: Number(payload.stockAmount),
      }),
      ...(imageArray !== undefined && { image: imageArray }),
    };

    // Check if product exists
    const isExistProducts = await getProductsById(id);
    if (!isExistProducts) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Product not found!');
    }

    // Only delete old images if new images are being uploaded and they're actual files
    if (
      isExistProducts.image.length > 0 &&
      payload.image &&
      !Array.isArray(payload.image) &&
      typeof payload.image !== 'string'
    ) {
      isExistProducts.image.forEach((image: string) => {
        unlinkFile(image);
      });
    }

    // Validate and update
    await ProductsValidation.updateProductsZodSchema.parseAsync(numericPayload);

    // Use $set operator with special handling for details array
    const updateQuery = { $set: numericPayload };

    // If details field exists in payload, ensure it completely replaces the old array
    if (parsedDetails !== undefined) {
      updateQuery.$set.details = parsedDetails;
    }

    const result = await Products.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    if (!result) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update product!');
    }
    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid details format');
    }
    throw error;
  }
};

const deleteProducts = async (id: string): Promise<IProducts | null> => {
  const isExistProducts = await getProductsById(id);
  if (!isExistProducts) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Products not found!');
  }

  if (isExistProducts.image.length > 1) {
    isExistProducts.image.map((image: string) => {
      unlinkFile(image);
    });
  }
  const result = await Products.findByIdAndDelete(id);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete products!');
  }
  return result;
};

export const ProductsService = {
  createProducts,
  getAllProductss,
  getProductsById,
  updateProducts,
  deleteProducts,
};
