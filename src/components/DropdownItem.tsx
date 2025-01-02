import { useEffect, useRef, type MouseEventHandler } from 'react'
import type { Option } from './Select'
import styles from '../css/DropdownItem.module.css'

interface DropdownItemProps {
 option: Option;
 selectedValue: Option['value'];
 focusedIndex: number;
 index: number;
 onClick: () => void;
 onHover: MouseEventHandler<HTMLDivElement>;
}

const DropdownItem = ({
 option,
 selectedValue,
 focusedIndex,
 index,
 onClick,
 onHover,
}: DropdownItemProps) => {
 const itemRef = useRef<HTMLDivElement>(null)

 const backgroundColor = (
  focusedIndex: number,
  current: Option['value']
 ) => {
  return option.value === current // selected
   ? '#E6F1FF'
   : index === focusedIndex // hover
    ? '#f3f3f3'
    : ''
 }

 // 선택된 옵션 스크롤 핸들링
 useEffect(() => {
  const timer = setTimeout(() => {
   if (itemRef.current) {
    itemRef.current?.scrollIntoView({
     block: 'nearest',
    })
   }
  })
  return () => clearTimeout(timer);
 }, [focusedIndex])

 return (
  <div
   id={`option-${index}`}
   className={styles['list-item']}
   ref={index === focusedIndex ? itemRef : null}
   onClick={onClick}
   style={{
    backgroundColor: backgroundColor(focusedIndex, selectedValue),
   }}
   onMouseOver={onHover}
  >
   {option.label}
  </div>
 )
}

export default DropdownItem