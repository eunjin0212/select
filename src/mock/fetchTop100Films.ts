import top100Films from "./top100Films.json"

interface Data { value: string; label: string }

/**
 * @description 300ms 지연 후 top100Films 리턴
 */
const fetchTop100Films = (): Promise<Data[]> => {
 return new Promise((resolve) => {
  setTimeout(() => {
   resolve(top100Films);
  }, 300);
 });
};
export { fetchTop100Films }
