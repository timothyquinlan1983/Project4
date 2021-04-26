
import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
// import {Line} from 'react-chartjs-2';
import {
    ResponsiveContainer, LineChart, Line, XAxis, YAxis, ReferenceLine, ReferenceArea,
    ReferenceDot, Tooltip, CartesianGrid, Legend, Brush, ErrorBar, AreaChart, Area,
    Label, LabelList
} from 'recharts';

// 1. Get the look and feel of the Stock name and BUY and SELL buttons going
// 2. Work on the Table UI

// Next Session

// 1. Add database to the backend server
// 2. Add api router to the backend server
// 3. Define the models in the system
// 4. Test out the API in a REST client like postman

// Next Session

// 1. Set up an initial value for the wallet/ Seed the wallet with a certain amount
// 2. Search a stock from the React APP front end and show the results
// 3. Ability to buy a stock
// 4. Ability to sell a stock

// HW
// 1. Stop showing the boxes below on the second search
// 2. Make the cash value show up as an actual number - fetch the wallet value from the backend on page load HINT: use useEffect
// 3. Show the portfolio items in the table on the right hand side

// Next Session
// 1. Make sure we update the cash/wallet when we buy stock
// 2. Cleaning up the UI
// 3. Host the app on heroku

// Latest HW
// 1. Figure out a way to not buy a stock unless the wallet can cover the transaction. If not show an error
// 2. Show only update two decimal places in the wallet value on the UI
// 3. Host the app on heroku

// For submission
// 1. Show the portfolio items on the right hand side box. List out the stocks bought
// 2. Add a sell button Besides each stock, once i click on the sell button for a stock, it should delete the stock from the portfolio table and update the wallet
// 3. Host the app on heroku


// Latest HW:

// 1. USe a nice element to show the error box.


function App() {

    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState();
    const [buyQuantity, setBuyQuantity] = useState();
    const [wallet, setWallet] = useState();

    const [historicalData, setHistoricalData] = useState();

    // http://localhost:3000/api/v1/portfolio

    console.log(process.env.REACT_APP_API_URL);
    let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000'



    const searchStock = async () => {
        console.log('searching for the stock')
        console.log(searchTerm);
        let res = await fetch(`${apiUrl}/api/v1/search/${searchTerm}`);
        let json = await res.json();
        console.log(json);
        setActiveSearch(json.data);

        // http://localhost:3000/api/v1/search/AAPL/historical
        let data = [];
        res = await fetch(`${apiUrl}/api/v1/search/${searchTerm}/historical`);
        json = await res.json();
        console.log(json)
        let dates = { 0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu', 4: 'Fri', 5: 'Sat', 6: 'Sun' };
        json.data.map((item, idx) => {
            data.push({ date: dates[idx], price: item.close });
        })

        console.log(data)
        setHistoricalData(data);

    };

    const fetchWallet = async () => {
        console.log('fetches the wallet from the backend')
        let res = await fetch(`${apiUrl}/api/v1/wallet`);
        let json = await res.json();
        console.log(json);
        setWallet(json.value);
    };

    useEffect(() => {
        fetchWallet();
    }, [])

    const buyStock = async () => {
        console.log('buy the stock!')
        let cashRequired = buyQuantity * activeSearch.price;
        console.log(cashRequired)
        if (cashRequired <= wallet) {
            let res = await fetch(`${apiUrl}/api/v1/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({
                    symbol: searchTerm,
                    quantity: buyQuantity,
                    price: activeSearch.price
                })
            });
            let json = await res.json();
            console.log(json);
            // at this point the transaction has been successful, you need to show the updated wallet information now.
            fetchWallet()
            setBuyQuantity(null)
            setSearchTerm(null)
            setActiveSearch(null)

        } else {
            alert('Not enough cash to cover the transaction.');
        }



    };



    // const data = {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [
    //         {
    //             label: 'My First dataset',
    //             fill: false,
    //             lineTension: 0.1,
    //             backgroundColor: 'rgba(75,192,192,0.4)',
    //             borderColor: 'rgba(75,192,192,1)',
    //             borderCapStyle: 'butt',
    //             borderDash: [],
    //             borderDashOffset: 0.0,
    //             borderJoinStyle: 'miter',
    //             pointBorderColor: 'rgba(75,192,192,1)',
    //             pointBackgroundColor: '#fff',
    //             pointBorderWidth: 1,
    //             pointHoverRadius: 5,
    //             pointHoverBackgroundColor: 'rgba(75,192,192,1)',
    //             pointHoverBorderColor: 'rgba(220,220,220,1)',
    //             pointHoverBorderWidth: 2,
    //             pointRadius: 1,
    //             pointHitRadius: 10,
    //             data: [65, 59, 80, 81, 56, 55, 40]
    //         }
    //     ]
    // };

    const data = [
        { date: 'Mon', price: 105.35 },
        { date: 'Tue', price: 102.71 },
        { date: 'Wed', price: 100.7 },
        { date: 'Thu', price: 96.45 },
        { date: 'Fri', price: 96.96 },
    ]

    return (
        <>
            <div className={'grid grid-cols-12'}>
                <div className={'col-span-12 border p-3'}>
                    <h1 className={'text-2xl text-center font-bold'}></h1>
                </div>

                <div className={'col-span-12 md:col-span-6 border p-5'}>
                    {/*<h1 className={'text-3xl font-bold'}>Box 1</h1>*/}

                    <div className={'grid grid-cols-12'}>
                        <div className={'col-span-12 md:col-span-6 mb-4'}>




                            {/*<Line data={data} />*/}

                            {/*<StockChart />*/}

                            <input onChange={(ev) => setSearchTerm(ev.currentTarget.value)} type={'search'} className={'border p-2 w-2/3 border-gray-300 rounded mr-2'} />
                            <button className={'p-2 bg-blue-600 rounded text-white cursor-pointer'} onClick={searchStock}>Search</button>


                        </div>
                        <div className={'col-span-12 md:col-span-6 hidden md:block p-3'}>
                            <h1 className={'text-3xl font-bold text-right text-green-600'}>${parseFloat(wallet).toFixed(2)}</h1>
                        </div>
                        {activeSearch && <div className={'col-span-12 md:col-span-6 p-3 bg-gray-200'}>
                            <h1 className={'text-2xl font-bold text-gray-600'}>
                                {searchTerm}
                                <p className={'text-xs text-gray-400'}>{activeSearch.currency} {activeSearch.price}</p>
                            </h1>
                        </div>}
                        {activeSearch && <div className={'col-span-12 md:col-span-6 p-3'}>

                            {/*    onChange={(ev) => {*/}
                            {/*    let currentValue = ev.currentTarget.value;*/}
                            {/*    if(currentValue>25){*/}
                            {/*        alert('Show error!')*/}
                            {/*    }*/}
                            {/*}}*/}

                            <input onChange={(ev) => setBuyQuantity(ev.currentTarget.value)}
                                type="number"
                                className={'border p-2 w-20 border-gray-300 rounded mr-2'} />
                            <button onClick={buyStock} className={'p-2 bg-blue-600 rounded text-white cursor-pointer w-1/3'}>Buy</button>
                        </div>}
                        <div className={'col-span-12  p-3'}>
                            {/*Box 7*/}


                            {/*<LineChart*/}
                            {/*    width={400}*/}
                            {/*    height={400}*/}
                            {/*    data={data}*/}
                            {/*    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}*/}
                            {/*>*/}
                            {/*    <XAxis dataKey="name" />*/}
                            {/*    <Tooltip />*/}
                            {/*    <CartesianGrid stroke="#f5f5f5" />*/}
                            {/*    <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />*/}
                            {/*    <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />*/}
                            {/*</LineChart>*/}

                            {/*Try to cleanup the chart and make it look leaner*/}
                            {historicalData && <LineChart
                                width={800} height={400} data={historicalData}
                                margin={{ top: 40, right: 40, bottom: 20, left: 20 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="date" label="" />
                                <YAxis domain={['auto', 'auto']} label="" />
                                <Tooltip
                                    wrapperStyle={{
                                        borderColor: 'white',
                                        boxShadow: '2px 2px 3px 0px rgb(204, 204, 204)',
                                    }}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#666666' }}
                                />
                                <Line dataKey="price" stroke="#ff7300" dot={false} />
                                <Brush dataKey="date" startIndex={historicalData.length - 7}>
                                    <AreaChart>
                                        <CartesianGrid />
                                        <YAxis hide domain={['auto', 'auto']} />
                                        <Area dataKey="price" stroke="#ff7300" fill="#ff7300" dot={false} />
                                    </AreaChart>
                                </Brush>
                            </LineChart>}




                        </div>
                    </div>

                </div>

                <div className={'col-span-12 md:col-span-6 border p-5'}>
                    <table className={'border w-full'}>
                        <thead>
                            <tr className={'border'}>
                                <th>Stock</th>
                                <th>Quantity</th>
                                <th>Value</th>
                                <th>Buy</th>
                                <th>Sell</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={'border'}>
                                <td>(ticker)</td>
                                <td>(number)</td>
                                <td>(price)</td>
                                <td><input type="radio"></input></td>
                                <td><input type="radio"></input></td>
                            </tr>
                            <tr className={'border'}>
                                <td>(ticker)</td>
                                <td>(number)</td>
                                <td>(price)</td>
                                <td><input type="radio"></input></td>
                                <td><input type="radio"></input></td>
                            </tr>
                        </tbody>
                    </table>



                </div>

            </div>
        </>
    );
}

export default App;