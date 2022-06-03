import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import MarginInput from "./MarginInput"
import Tooltip from "../Tooltip"

const LayoutMenu = () => {

    return (
        <motion.div className="max-w-20 flex items-center justify-center">
            <h4 id="margins" className="text-md bold text-gray-600" >Margins:</h4>
            <MarginInput />
            <Tooltip />
        </motion.div>
    )
}

export default LayoutMenu