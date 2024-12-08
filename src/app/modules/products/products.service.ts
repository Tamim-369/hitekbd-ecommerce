import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Products } from './products.model';
import { IProducts } from './products.interface';
import { ProductsValidation } from './products.validation';
import unlinkFile from '../../../shared/unlinkFile';

const createProducts = async (payload: IProducts): Promise<IProducts> => {
  console.log();
  payload.details = await JSON.parse(payload.details.toString());
  payload.details = await Promise.all(
    payload.details.map(async (detail: any) => {
      return {
        name: detail.name,
        value: detail.value,
      };
    })
  );
  await ProductsValidation.createProductsZodSchema.parseAsync(payload);
  const result = await Products.create(payload);
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create products!');
  }
  return result;
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
  payload: IProducts
): Promise<IProducts | null> => {
  await ProductsValidation.updateProductsZodSchema.parseAsync(payload);
  const isExistProducts = await getProductsById(id);
  if (!isExistProducts) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Products not found!');
  }
  if (isExistProducts.image.length > 1 && payload.image.length > 1) {
    isExistProducts.image.map((image: string) => {
      unlinkFile(image);
    });
  }
  const result = await Products.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to update products!');
  }
  return result;
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
