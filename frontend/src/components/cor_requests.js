import {useState,useEffect} from 'react'
import { FaSort } from "react-icons/fa";
import {  useNavigate } from 'react-router-dom';

export const RequstsLists=()=>{
	const [ requestsList, setRequestsList ] = useState( [] )
	const [ filteredData, setFilteredData ] = useState( [] )
	const [boolean,setBoolean]=useState(false)


	const navigate=useNavigate()
	useEffect(()=>{
 			const fetchData = async () => {
            try {
							const response = await fetch('http://localhost:3005/requestlist');
							const requests = await response.json();
							setRequestsList( requests.requestsList );
							setFilteredData(requests.requestsList)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
	}, [] )

	const handleRequestRows=(e)=>{
	 	const	requestrowid = e.currentTarget.dataset.requestrowid;
		navigate(`/coordinator/requestrows/${requestrowid}`)
	}
	const handleSearchResult=(e)=>{
		e.preventDefault();
		const reqId = document.querySelector( '.itemid' ).value
		console.log( reqId );
		try {
			const search = requestsList.filter( item =>
			{
				console.log(item.requestid);
				return item ? item.requestid==reqId : false
			} )
			console.log( search );
			if (search.length>0) {
				setFilteredData(search)
			}
			else{
				setFilteredData(requestsList)
			}
		} catch (error) {
			console.log(error);
		}
	}
		const table_body = filteredData?.map( request =>
		<tr onClick={handleRequestRows} data-requestrowid={request.requestrowid} data-id={request.requestid} key={request.requestid}>
			<td >{ request.itemid}</td>
			<td >{ request.requestid}</td>
			<td >{ request.itemname}</td>
			<td>{ request.employeename }</td>
			<td>{ request.unitofmeasurement }</td>
			<td>{ request.quantity }</td>
			<td>{ request.pricewithoutvat }</td>
			<td>{ request.status }</td>
			<td>{ request.comment }</td>
			<td>{ request.requestrowid }</td>
		</tr>
	);
	//const handleSearchResult=async (e)=>{
	//	e.preventDefault();

	//	console.log(document.querySelector( '.itemname' ));
	//	const requestId = document.querySelector( '.itemname' ).value;
	//	console.log(requestId);
	//	try {
	//		if (requestId.length>0) {
	//			const response = await fetch(`http://localhost:3005/itemtable/search/name/${encodeURIComponent(itemname)}`);
	//		 	const data = await response.json(); // Wait for the JSON data to be parsed
  //      console.log(data);
	//		if (response.ok) {
	//			setFilteredData(data)
	//		}else{
	//			alert( 'item not found' )
	//			setFilteredData(requestsList)
	//		}
	//		}
	//		else
	//		{
	//			setFilteredData(requestsList)
	//		}


	//	} catch (error) {
	//		console.log(error);
	//	}

	//}
	const SortItemByHeaders = (e) => {
		const headerName = e.currentTarget.dataset.name;
		const sortedArray = [...requestsList];

		sortedArray.sort((a, b) => {
				const valueA = typeof a[headerName] === 'string' ? a[headerName].toLowerCase() : a[headerName];
				const valueB = typeof b[headerName] === 'string' ? b[headerName].toLowerCase() : b[headerName];

				if (valueA < valueB) {
					setBoolean(true)
					return -1;
			}
			return 0
		});
		if (boolean) {
			console.log('is it reversed');
			sortedArray.reverse();
			setBoolean(false)
		}

		setFilteredData(sortedArray);
	};





	return (
		<div className="container">
			<div className="control-buttons">
				<form className='search' onChange={handleSearchResult}>
					<input  className='itemid' type="number" placeholder='search by request id' />
					<input type="submit" />
				</form>
				<button onClick={ () => navigate( '/logged' ) }>List Of Goods</button>
				<button onClick={()=> navigate('/')} >Log Out</button>
			</div>
			<div className="goods">
				<table>
						<thead>
							<tr>
								<th onClick={SortItemByHeaders} data-name='itemid'>Item ID  <FaSort/></th>
								<th onClick={SortItemByHeaders} data-name='requestid'>Request ID  <FaSort/></th>
								<th onClick={SortItemByHeaders} data-name='itemname'>Item Name  <FaSort/></th>
								<th onClick={SortItemByHeaders} data-name='employeename'>Employee Name  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='unitofmeasurement'>Unit of Measurement  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='quantity'>Quantity  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='pricewithoutvat'>Price Without VAT  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='status'>Status  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='comment'>Comment <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='requestrowid'>Request row id  <span><FaSort/></span></th>
							</tr>
					</thead>
					<tbody>
						{table_body}
					</tbody>
				</table>
				</div>
		</div>
	)
}