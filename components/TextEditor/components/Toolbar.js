import { forwardRef } from "react"
import dynamic from 'next/dynamic'
const  MarkButton = dynamic(() => import('./MarkButton'), {ssr: false})
const  BlockButton = dynamic(() => import('./BlockButton'), {ssr: false})

const Toolbar = forwardRef((props, ref) => {
    return (
        <div 
          {...props} 
          ref={ref}
          className='flex justify-center items-center bg-white'
          >
            <MarkButton format="bold" icon="format_bold" />
            <MarkButton format="italic" icon="format_italic" />
            <MarkButton format="underline" icon="format_underlined" />
            <MarkButton format="code" icon="code" />
            <BlockButton format="heading-one" icon="looks_one" />
            <BlockButton format="heading-two" icon="looks_two" />
            <BlockButton format="block-quote" icon="format_quote" />
            <BlockButton format="numbered-list" icon="format_list_numbered" />
            <BlockButton format="bulleted-list" icon="format_list_bulleted" />
            <BlockButton format="left" icon="format_align_left" />
            <BlockButton format="center" icon="format_align_center" />
            <BlockButton format="right" icon="format_align_right" />
            <BlockButton format="justify" icon="format_align_justify" />
        </div>
    )
})

export default Toolbar