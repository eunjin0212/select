import {
 type ReactNode,
 type RefObject,
 useEffect,
 useRef,
 useState,
} from 'react'
import { createPortal } from 'react-dom'
import styles from '../css/Dropdown.module.css'

interface DropdownProps {
 id: string
 parentRef: RefObject<HTMLFieldSetElement>
 children: ReactNode
}

const initialParentDOMRect = {
 height: 0,
 width: 0,
 x: 0,
 y: 0,
 bottom: 0,
 left: 0,
 right: 0,
 top: 0,
}

const Dropdown = ({ id, children, parentRef }: DropdownProps) => {
 const select = parentRef.current as Element

 const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
 const [parentPosition, setParentPosition] = useState<Omit<DOMRect, 'toJSON'>>(initialParentDOMRect)

 const dropdownRef = useRef<HTMLDivElement>(null)

 // mount 시, 옵션 목록의 방향을 지정
 useEffect(() => {
  if (!select || !dropdownRef.current) return

  const rect = select.getBoundingClientRect()
  setParentPosition(rect)

  const spaceBottom = window.innerHeight - rect.bottom
  const spaceTop = rect.y

  const listMaxHeight = Math.min(380, Math.max(spaceTop, spaceBottom))

  const updateListMaxHeight = (height: number) => {
   if (!dropdownRef.current) {
    return
   }

   dropdownRef.current.style.maxHeight = `${height}px`
  }

  const updateListTop = (top: number) => {
   if (!dropdownRef.current) {
    return
   }

   dropdownRef.current.style.top = `-${top + 4}px`
  }

  // 둘 다 자리가 없을 경우, option 높이 조정
  if (spaceTop <= listMaxHeight && spaceBottom <= listMaxHeight) {
   const adjustedMaxHeight = window.innerHeight * 0.8 - rect.y - rect.height;
   updateListMaxHeight(adjustedMaxHeight)

   const margin = 20
   if (spaceTop < spaceBottom) {
    setPosition('bottom');
    updateListMaxHeight(Math.min(listMaxHeight, spaceBottom) - margin);
   } else {
    setPosition('top');
    updateListTop(Math.min(listMaxHeight, spaceTop) - margin)
    updateListMaxHeight(Math.min(listMaxHeight, spaceTop) - margin);
   }
   return
  }

  updateListMaxHeight(listMaxHeight)

  if (spaceBottom < listMaxHeight) {
   updateListTop(listMaxHeight)
  }

  setPosition(spaceBottom < listMaxHeight ? 'top' : 'bottom')
 }, [select])

 return (select
  ? createPortal(
   <div
    id={`portal-${id}`}
    className={`${styles['list-wrapper']} ${styles[`list-wrapper--${position}`]}`}
    style={{ width: `${parentPosition.width}px` }}
    ref={dropdownRef}
   >
    <div id={`options-${id}`}
     className={styles.list}
    >
     {children}
    </div>
   </div>,
   select
  )
  : null)
}

export default Dropdown