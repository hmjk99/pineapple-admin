
import {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function ProductForm({
    _id,
    title:existingTitle,
    description:existingDescription,
    price:existingPrice,
    images,
}) {
    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [price, setPrice] = useState(existingPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const router = useRouter()

    async function saveProduct(e) {
        const data = {title,description,price}
        e.preventDefault()
        if (_id){
            //update
            await axios.put('/api/products', {...data,_id})
        } else{
            //create product
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }

    const uploadImages = async (e) =>{
        const files = e.target?.files
        if (files?.length > 0){
            const data = new FormData()
            files.forEach(file => data.append('file', file))
            const res = await axios.post('/api/upload', data)
        }
    }

    if(goToProducts){
        router.push('/products')
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product Name</label>
            <input type='text' placeholder='product name' value={title} onChange={e => setTitle(e.target.value)}/>
            <label>Images</label>
            <div className='mb-2'>
                <label className='cursor-pointer w-24 h-24 flex flex-col items-center justify-center text-gray-500 rounded-lg bg-gray-200'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
                    </svg>
                    <div>Upload</div>
                    <input type="file" className='hidden'onChange={uploadImages}/>
                </label>
                {!images?.length && (
                    <div>No photos in this product</div>
                )}
            </div>
            <label>Description</label>
            <textarea placeholder='description' value={description} onChange={e => setDescription(e.target.value)}></textarea>
            <label>Price (in USD)</label>
            <input type='number' placeholder='price' value={price} onChange={e => setPrice(e.target.value)}/>
            <button type='submit' className='btn-primary'>Save</button>
        </form>
    )
}