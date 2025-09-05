import { toast } from 'sonner';

export const handleRequest = async (
  message?: string,
  isSuccess: boolean = true,
  refetch?: () => void
) => {
  if (isSuccess) {
    toast.success(message);
    refetch?.();
  } else {
    toast.error(message);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
};
