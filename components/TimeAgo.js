import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ReactTimeAgo from 'react-time-ago'

TimeAgo.addDefaultLocale(en)

const Time = ({className, date}) => {
  return (
    <span className={className}>
      <ReactTimeAgo date={date} locale="en-US"/>
    </span>
  )
}

export default Time