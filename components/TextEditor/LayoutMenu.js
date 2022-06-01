import { Icon, Input } from "@material-tailwind/react"
import { motion } from "framer-motion"

const LayoutMenu = () => {
    return (
        <motion.div className="max-w-20">
            <label id="margins" className="text-md bold text-gray-600" >Margins:</label>
            <Input
                outline={true}
                placeholder='horizontal'
                color='gray'
                type='number'
                min='0.5'
                size='sm'
                aria-describedby="margins"
                step='0.1'
            />
        </motion.div>
    )
}

export default LayoutMenu