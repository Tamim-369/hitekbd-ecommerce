import { useState } from 'react';
import Input from './Input';

interface EditProfileFormProps {
  initialData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    subDistrict: string;
    district: string;
    city: string;
    state: string;
  };
  onSave: (data: EditProfileFormProps['initialData']) => void;
}

export default function EditProfileForm({
  initialData,
  onSave,
}: EditProfileFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Partial<typeof initialData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof initialData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <Input
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Input
        label="Phone Number"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
      />

      <Input
        label="District (জেলা)"
        name="district"
        value={formData.district}
        onChange={handleChange}
      />
      <Input
        label="Sub District (থানা)"
        name="subDistrict"
        value={formData.subDistrict}
        onChange={handleChange}
      />
      <Input
        label="Address (ঠিকানা)"
        name="address"
        value={formData.address}
        onChange={handleChange}
      />
      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-[#37c3fa] to-[#c937fb]
    shadow-lg hover:shadow-xl
    transform transition-all duration-200
    hover:-translate-y-0.5 hover:opacity-95
    focus:outline-none focus:ring-2 focus:ring-[#37c3fa] focus:ring-opacity-50
    active:opacity-90"
        >
          Update Changes
        </button>
      </div>
    </form>
  );
}
