import { forwardRef } from "react"

const Logo = forwardRef((props, ref) => {
    return (
        <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" {...props}>
            <path d="M42.54,68,72.86,54.38l-1.6-3.55L40.94,64.47Zm8,49.08a8,8,0,0,1-10.3-3.91L4,32.69a7.44,7.44,0,0,1-.11-5.93,7.47,
7.47,0,0,1,4-4.37L50.65,3.16,88.24,17.42,116,79.11a8,8,0,0,1-3.9,10.3ZM60.2,33.88l-9.9-22L11.11,29.49h0L47.33,
110h0l61.56-27.7h0L82.58,23.82ZM11.11,29.49l9.91,22-9.91-22,9.91,22L47.33,110h0L11.11,29.49ZM45,73.62,83.12,
56.47l-1.6-3.55L43.4,70.07Zm2.43,5.64L75.08,66.82l-1.6-3.55L45.83,75.71Zm2.7,5.58L88.25,
67.69l-1.6-3.55L48.53,81.29Zm2.61,5.61L86.32,75.34l-1.59-3.55L51.14,86.9ZM55.65,96,78.17,85.84l-1.6-3.55L54.05,92.42Z" />
        </svg>
    )
})

export default Logo