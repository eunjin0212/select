import { useState } from 'react'
import { fetchTop100Films } from '../mock/fetchTop100Films'
import top100Films from '../mock/top100Films.json'
import Select from '../components/Select'

const DemoPage = () => {
 const [selectedValue, setSelectedValue] = useState<string>('')
 const [fetchSelectedValue, setFetchSelectedValue] = useState<string>('')
 const [bottomSelectedValue, setBottomSelectedValue] = useState<string>('')
 return (
  <div style={{ height: '100vh' }}>
   <Select
    value={selectedValue}
    options={top100Films}
    onChange={(selected) => setSelectedValue(selected.value)}
   />
   <Select
    value={fetchSelectedValue}
    options={fetchTop100Films}
    onChange={(selected) => setFetchSelectedValue(selected.value)}
   />
   <div style={{ position: 'absolute', bottom: 0 }}>
    <Select
     value={bottomSelectedValue}
     options={top100Films}
     onChange={(selected) => setBottomSelectedValue(selected.value)}
    />
   </div>
  </div>
 )
}

export default DemoPage