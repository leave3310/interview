import { axiosInstance } from '@/api/instance';
import { useToDoStore } from '@/stores/todo';

export interface BaseCRUDTest {
  id: string;
  name: string;
  age: number;
}
type PostCRUDTest = Omit<BaseCRUDTest, 'id'>;

export const getCRUDTest = async () => {
  const toDoStore = useToDoStore();

  try {
    const res: BaseCRUDTest[] = await axiosInstance.get('/a');
    toDoStore.updateTodoList(res);
  } catch (err) {
    console.error(err);
  }
};

export const postCRUDTest = async (payload: PostCRUDTest) => {
  try {
    await axiosInstance.post('', payload);
  } catch (err) {
    console.error(err);
  }
};

export const patchCRUDTest = async (payload: BaseCRUDTest) => {
  try {
    await axiosInstance.patch('', payload);
  } catch (err) {
    console.error(err);
  }
};

export const deleteCRUDTest = async (id: string) => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (err) {
    console.error(err);
  }
};
