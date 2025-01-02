import {
 render,
 screen,
 waitFor,
 fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'
import Select from '../components/Select'
import top100Films from "../mock/top100Films.json"
import { fetchTop100Films } from '../mock/fetchTop100Films'

jest.mock('../mock/fetchTop100Films', () => ({
 fetchTop100Films: jest.fn(),
}));

test('option은 배열 타입을 갖는다.', async () => {
 render(<Select options={top100Films} />);

 await waitFor(async () => {
  top100Films.forEach(async (film) => {
   expect(await screen.findByText((_, element) => {
    return element?.textContent === film.label;
   })).toBeInTheDocument();
  });
 });
});

test('option은 함수 타입을 갖는다.', async () => {
 (fetchTop100Films as jest.Mock).mockImplementation(() => Promise.resolve(top100Films));

 render(<Select options={fetchTop100Films} />);

 expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

 await waitFor(async () => {
  top100Films.forEach(async (film) => {
   expect(await screen.findByText((_, element) => {
    return element?.textContent === film.label;
   })).toBeInTheDocument();
  });
 });
});

const options = [
 { value: '1', label: 'Short' },
 { value: '2', label: 'Medium length' },
 { value: '3', label: 'This is the longest option' },
]

test('Select 폭은 option의 가장 긴 option에 맞춘다.', () => {
 render(<Select options={options} />);
 const select = screen.getByTestId('select-element');
 const expectedWidth = 'This is the longest option'.length * 9;
 expect(select).toHaveStyle(`width: ${expectedWidth}px`);
})

test('option을 검색할 수 있다.', async () => {
 render(<Select options={options} />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.change(inputElement, { target: { value: options[0].label } });

 const optionElement = await screen.findByText(options[0].label);
 expect(optionElement).toBeInTheDocument();

 const irrelevantOption = screen.queryByText(options[1].label);
 expect(irrelevantOption).not.toBeInTheDocument();
});

test('값이 선택되지 않았을 때, 포커스가 아웃 되면 검색어가 삭제되어야 한다.', async () => {
 render(<Select options={options} />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.change(inputElement, { target: { value: options[0].label } });

 expect(inputElement).toHaveValue(options[0].label);

 fireEvent.blur(inputElement);

 expect(inputElement).toHaveValue('');
});

test('키보드로 option을 검색할 수 있어야한다. 엔터 시, 값 선택이 가능하다.', async () => {
 render(<Select options={options} />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.change(inputElement, { target: { value: options[0].label } });

 const optionElement = await screen.findByText(options[0].label);
 expect(optionElement).toBeInTheDocument();

 fireEvent.keyDown(inputElement, { key: 'ArrowDown' });
 fireEvent.keyDown(inputElement, { key: 'Enter' });

 expect(inputElement).toHaveValue(options[0].label);
});

test('마우스로 option을 검색할 수 있어야한다. 클릭 시, 값 선택이 가능하다.', async () => {
 render(<Select options={options} />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.click(inputElement);

 fireEvent.change(inputElement, { target: { value: options[0].label } });

 const optionElement = await screen.findByText(options[0].label);
 expect(optionElement).toBeInTheDocument();

 fireEvent.click(optionElement);

 expect(inputElement).toHaveValue(options[0].label);
});

test('선택된 option이 있다면 강조되어야 한다.', async () => {
 render(<Select options={options} value='1' />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.click(inputElement);

 const highlightedOption = await screen.findByText(options[0].label);
 expect(highlightedOption).toHaveStyle('background-color: #E6F1FF');
});

beforeAll(() => {
 Element.prototype.scrollIntoView = jest.fn();
});

test('선택된 option이 있다면 list가 열렸을 때 보여야 한다.', async () => {
 render(<Select options={top100Films} value='30' />);

 const inputElement = screen.getByRole('textbox');
 fireEvent.click(inputElement);

 const optionElement = await screen.findByText(top100Films[29].label);
 expect(optionElement).toBeInTheDocument();
});
