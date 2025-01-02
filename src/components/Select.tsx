import {
 type ChangeEvent,
 type KeyboardEvent,
 type MouseEvent,
 useEffect,
 useRef,
 useState,
 useId,
 useMemo,
} from 'react'
import styles from '../css/Select.module.css'
import List from './Dropdown'
import ListItem from './DropdownItem'

export interface Option { value: string; label: string }
export type Options = Option[]

type SelectProps = {
 value?: string | null
 options: Options | (() => Promise<Options>)
 onChange?: (payload: Option) => void
}

function Select({
 value,
 options,
 onChange,
}: SelectProps) {
 const defaultOption = { label: '', value: '' }

 const id = useId()
 const [isLoading, setIsLoading] = useState(false)
 const [width, setWidth] = useState<number>(0)

 const inputRef = useRef<HTMLInputElement>(null)
 const fieldsetRef = useRef<HTMLFieldSetElement>(null)

 const [isDropdownOpen, setIsDropdownOpen] = useState(false)
 const [focusedIndex, setFocusedIndex] = useState(-1)

 const [inputValue, setInputValue] = useState<string>('')
 const [selectedOption, setSelectedOption] = useState(defaultOption)

 const [filteredOptions, setFilteredOptions] = useState<Options>([])
 const [originalOptions, setOriginalOptions] = useState<Options>([])

 const currentOptions = useMemo<Options>(() =>
  !inputValue ||
   (!!selectedOption.value && selectedOption.label === inputValue) // 사용자가 입력한 값이 없거나, 선택된 옵션 값이 현재 값과 일치하면 검색 됨으로 판단
   ? originalOptions
   : filteredOptions,
  [filteredOptions, inputValue, originalOptions, selectedOption])

 const calculateSelectWidth = (opts: Options) => {
  const maxLabelLength = Math.max(
   ...opts.map((option) => option.label.length)
  );

  const fontWith = 9 // 평균 문자 너비 Roboto 글꼴 평균 너비 8~9
  setWidth(maxLabelLength * fontWith);
  setOriginalOptions(opts);
 }

 const fetchOptions = async () => {
  try {
   setIsLoading(true);
   const fetchedOptions = (
    Array.isArray(options)
     ? options
     : (await options()) as Options
   )

   calculateSelectWidth(fetchedOptions)
   if (value) {
    const initialIndex = fetchedOptions.findIndex((opt) => opt.value === value)

    setInputValue(fetchedOptions[initialIndex]?.label || '');
    setSelectedOption(fetchedOptions[initialIndex] || defaultOption);
    setFocusedIndex(initialIndex || -1);
   }
  } catch (error) {
   console.error('Failed to load options', error);
  } finally {
   setIsLoading(false);
  }
 };

 useEffect(() => {
  fetchOptions();
 }, [options, value])

 // input 클릭 시
 const handleInputClick = (e: MouseEvent) => {
  e.stopPropagation()
  inputRef.current!.focus()
  !!selectedOption.value
   ? setIsDropdownOpen(true)
   : setIsDropdownOpen((val) => val = !val)
 }

 // input 변경 시
 const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  setIsDropdownOpen(true)

  const value = event.target.value
  setInputValue(value)

  const convertLabel = (label: string) => label.trim().toLowerCase()

  const filtered = originalOptions.filter((option) =>
   convertLabel(option.label).includes(convertLabel(value))
  )

  setFilteredOptions(filtered)
 }

 // option 선택
 const handleSelected = (index: number) => {
  setInputValue(currentOptions[index].label)
  setSelectedOption(currentOptions[index])

  const findIndex = currentOptions.findIndex((opt) => opt.label === currentOptions[index].label)
  setFocusedIndex(findIndex || -1)
  setIsDropdownOpen(false)

  onChange?.(currentOptions[index])
 }

 // focus out
 const handleBlur = () => {
  if (!selectedOption.value) {
   setInputValue('')
  }

  if (!isDropdownOpen) {
   inputRef.current!.focus()
  }

  setIsDropdownOpen(false)
 }

 const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  const { key } = e
  let nextHoverItemIndex = focusedIndex

  // 키보드 다운
  if (key === 'ArrowDown') {
   e.stopPropagation()

   setIsDropdownOpen(true)
   nextHoverItemIndex = (focusedIndex + 1) % currentOptions.length // 마지막 옵션인 경우 0으로 index 변경
  }

  // 키보드 업
  if (key === 'ArrowUp') {
   e.stopPropagation()
   setIsDropdownOpen(true)

   nextHoverItemIndex = (focusedIndex + currentOptions.length - 1) % currentOptions.length // 첫번째 옵션인 경우 0으로 index 변경
  }

  // 키보드 엔터 (선택)
  if (key === 'Enter') {
   e.preventDefault()

   handleSelected(focusedIndex)
   return
  }

  setFocusedIndex(nextHoverItemIndex);
 }

 if (!isLoading) {

 }
 return (
  <>
   {!isLoading ? (
    <div
     data-testid="select-element"
     className={styles.select}
     style={{ width: `${width}px` }}
     tabIndex={-1}
     onBlur={handleBlur}
     onKeyDown={handleKeyDown}
    >
     <fieldset
      tabIndex={1}
      className={[
       styles['selected-item'],
       isDropdownOpen && styles['selected-item__open']
      ].join(' ')}
      onClick={handleInputClick}
      ref={fieldsetRef}
     >
      <input
       ref={inputRef}
       value={inputValue}
       type='text'
       onChange={handleInputChange}
      />
     </fieldset>

     {isDropdownOpen && (
      <List
       id={id}
       parentRef={fieldsetRef}
      >
       {
        !currentOptions.length
         ? <p className='no-option'>No Option</p>
         : (
          currentOptions.map((opt, idx) => (
           <ListItem
            key={opt.value}
            option={opt}
            index={idx}
            focusedIndex={focusedIndex}
            onClick={() => handleSelected(idx)}
            onHover={() => setFocusedIndex(idx)}
            selectedValue={selectedOption.value}
           />
          ))
         )
       }
      </List>
     )
     }
    </div>
   ) : (
    // loading
    <p>Loading...</p>
   )}
  </>
 )
}

export default Select
