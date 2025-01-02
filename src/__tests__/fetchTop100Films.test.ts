import top100Films from "../mock/top100Films.json"
import { fetchTop100Films } from '../mock/fetchTop100Films'

jest.useFakeTimers();
test('fetchTop100Films should get Array after 300ms', async () => {
 const promise = fetchTop100Films();

 jest.advanceTimersByTime(300);

 const data = await promise;

 expect(data).toEqual(top100Films);
})