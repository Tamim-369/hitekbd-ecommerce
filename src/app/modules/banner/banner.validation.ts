import { zfd } from 'zod-form-data';
import { z } from 'zod';
        
const createBannerZodSchema = zfd.formData({
  image: zfd.file().optional()
});

const updateBannerZodSchema = zfd.formData({
  image: zfd.file().optional()
});

export const BannerValidation = {
  createBannerZodSchema,
  updateBannerZodSchema
};
