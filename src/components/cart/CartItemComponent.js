import {useState} from "react";

const CartItemComponent = ({
    cartItemNo,
    itemNo,
    itemName,
    price,
    initialCount,
    imageUrl,
    changeCart,
    memberId
}) => {
    const [count, setCount] = useState(initialCount);

    const handleClickQty = (amount) => {
        const newCount = count + amount;
        setCount(newCount); // 로컬 상태 업데이트
        changeCart({memberId, cartItemNo, itemNo, count: newCount});
    }

    return (
        <li key={cartItemNo} className="border-2">
            <div className="w-full border-2">
                <div className=" m-1 p-1 ">
                    <img src={`${imageUrl}`}/>
                </div>

                <div className="justify-center p-2 text-xl ">
                    <div className="justify-end w-full">

                    </div>
                    <div>Cart Item No: {cartItemNo}</div>
                    <div>Item No: {itemNo}</div>
                    <div>Name: {itemName}</div>
                    <div>Price: {price}</div>
                    <div className="flex ">
                        <div className="w-2/3">
                            count: {count}
                        </div>
                        <div>
                            <button
                                className="m-1 p-1 text-2xl bg-orange-500 w-8 rounded-lg"
                                onClick={() => handleClickQty(1)}
                            >
                                +
                            </button>
                            <button
                                className="m-1 p-1 text-2xl bg-orange-500 w-8 rounded-lg"
                                onClick={() => handleClickQty(-1)}
                            >
                                -
                            </button>
                        </div>
                    </div>
                    <div>
                        <div
                            className="flex text-white font-bold p-2 justify-center">


                            <button
                                className="m-1 p-1 text-xl text-white bg-red-500 w-8 rounded-lg"
                                onClick={() => handleClickQty(-1 * count)}
                            >
                                X
                            </button>
                        </div>
                        <div
                            className='font-extrabold border-t-2 text-right m-2 pr-4'>
                            {count * price} 원
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default CartItemComponent;
