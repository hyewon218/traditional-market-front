import {useEffect, useState} from "react"
import {getOne} from "../../api/marketApi"

const initState = {
    marketName: '',
    marketAddr: '',
    marketDetail: '',
    like: 0,
    imageList: [],
    imageUrl: ''
}
const ReadComponent = ({mno}) => {

    const [market, setMarket] = useState(initState)

    useEffect(() => {
        getOne(mno).then(data => {
            console.log(data)
            setMarket(data)
        })
    }, [mno])

    return (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4 ">
            {makeDiv('MarketName', market.marketName)}
            {makeDiv('MarketAddr', market.marketAddr)}
            {makeDiv('MarketDetail', market.marketDetail)}
            {makeDiv('Like', market.like)}
            <div
                className="w-full justify-center flex flex-col m-auto items-center">
                {market.imageList.map((imgUrl, i) =>
                    <img
                        alt="product" key={i}
                        className="p-4 w-1/2"
                        src={`${imgUrl.imageUrl}`}/>
                )}
            </div>
        </div>
    )
}

const makeDiv = (title, value) =>
    <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">{title}</div>
            <div
                className="w-4/5 p-6 rounded-r border border-solid shadow-md">{value}</div>
        </div>
    </ div>

export default ReadComponent