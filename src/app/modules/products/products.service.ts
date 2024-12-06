import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Products } from './products.model';
import { IProducts } from './products.interface';
import { ProductsValidation } from './products.validation';
import unlinkFile from '../../../shared/unlinkFile';

const createProducts = async (payload: IProducts): Promise<IProducts> => {
  console.log();
  payload.details = JSON.parse(payload.details);
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

const getAllProductss = async (
  search: string,
  page: number | null,
  limit: number | null
): Promise<IProducts[]> => {
  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { image: { $regex: search, $options: 'i' } },
        ],
      }
    : {};
  let queryBuilder = Products.find(query);

  if (page && limit) {
    queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
  }

  return await queryBuilder;
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
