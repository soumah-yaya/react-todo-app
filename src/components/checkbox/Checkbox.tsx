import React from 'react'
import './Checkbox.css'

interface checkboxProps {
    checked?: boolean | undefined,
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
    text?: string | undefined,
    name?: string | undefined
}
function Checkbox({ checked, onChange,text="checkbox", name }: checkboxProps) {

    return (
        <>
            <label className='checkbox__container'>
                <input name={name} type="checkbox" checked={checked} onChange={onChange} className='checkbox__input' />
                <span className='checkbox__new'></span>
                {text}
            </label>

        </>
    )
}

export default Checkbox