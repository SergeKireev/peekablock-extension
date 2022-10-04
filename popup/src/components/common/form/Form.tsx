import React, { HTMLProps } from 'react'

interface FormProps {
    title: string
    paragraph: string
    withHeaderSeparator?: boolean
}

type Props = FormProps & HTMLProps<void>

export const Form = (props: Props) => {
    const additionalClass = props.withHeaderSeparator ? 'with_bottom_border' : ''
    return <div>
        <div className={`new_form_header_container ${additionalClass}`}>
            <div className='new_form_message'>
                <div className='new_form_message_title'>
                    {
                        props.title
                    }
                </div>
                <div className='new_form_message_paragraph'>
                    {
                        props.paragraph
                    }
                </div>
            </div>
        </div>
        <div className="new_report_form_group">
            {
                props.children
            }
        </div>
    </div>
}