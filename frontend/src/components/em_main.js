import {useState,useEffect} from 'react'
import { FaSort } from "react-icons/fa";
import {  useNavigate } from 'react-router-dom';
import { FaFilter } from "react-icons/fa";


export const EmployeeMain = () =>{
	const [ listOfGoods, setListOfGoods ] = useState( [] );
	const [ requestList, setRequestList ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] );
	const [boolean,setBoolean]=useState(false)
	const navigate = useNavigate()

	useEffect(() =>{
 			const fetchData = async () => {
            try {
							const response = await fetch('http://localhost:3005/coordinatorpanel');
							const items = await response.json();
							setListOfGoods( items.listOfGoods );
							setFilteredData(items.listOfGoods)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
	}, [] )

	const handleOrderButton=()=>{
		const formContainer=document.querySelector('.order-form-container')
		formContainer.style.display='flex'


	}
	const handleCancelButton=()=>{
		const form = document.querySelector( '.order-form' );
		form.reset();
		const formContainer=document.querySelector('.order-form-container')
		formContainer.style.display = 'none'
		setRequestList([])
	}
	const addRequestHandler=(e)=>{
		e.preventDefault()
		const form = document.querySelector( '.order-form' );
		const formdata=new FormData(form);
		const dataOfForm = Object.fromEntries( formdata );
		if (Object.keys(dataOfForm).length > 0) {
				setRequestList(prevRequestList => [...prevRequestList, dataOfForm]);
				alert('Request added successfully.');
				// Reset the form after processing the request
				form.reset();
		} else {
				alert('There is a problem in the system. Please try again later.');
		}
	}

	const submitRequestHandler= async ()=>{
		console.log('first');
		try {
			console.log('incatch');
			const response = await fetch('http://localhost:3005/employeepanel/addrequest', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(requestList)
			} );
			console.log(response);
			if (response.ok) {
				alert( 'Request created' )
				const form = document.querySelector( '.order-form-container' );
				form.style.display='none'
			}else {
				const errorMessage = await response.text();
				alert(`Failed to add item: ${errorMessage}`);
			}
			setRequestList([])
		} catch (error) {
			console.log(error);
		}
	}
	const table_body = filteredData?.map( item =>
		<tr data-id={item.itemid} key={item.itemid}>
			<td >{ item.itemid }</td>
			<td >{ item.itemname}</td>
			<td>{ item.itemgroup }</td>
			<td>{ item.unitofmeasurement }</td>
			<td>{ item.quantity }</td>
			<td>{ item.pricewithoutvat }</td>
			<td>{ item.status }</td>
			<td>{ item.storagelocation }</td>
			<td>{ item.contactperson }</td>
			<td>{ item.photo }</td>

		</tr>
	);

	const SortItemByHeaders = (e) => {
		const headerName = e.currentTarget.dataset.name;
		const sortedArray = [...listOfGoods];

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

	const handleSearchResult=async (e)=>{
		e.preventDefault();
		const itemname = document.querySelector( '.itemname' ).value;
		console.log(itemname);
		try {
			if (itemname.length>0) {
					const response = await fetch(`http://localhost:3005/itemtable/search/name/${encodeURIComponent(itemname)}`);
			 const data = await response.json(); // Wait for the JSON data to be parsed
        console.log(data);
			if (response.ok) {
				setFilteredData(data)
			}else{
				alert( 'item not found' )
				setFilteredData(listOfGoods)
			}
			}
			else
			{
					setFilteredData(listOfGoods)
			}


		} catch (error) {
			console.log(error);
		}

	}


	return (
		<div className='container'>
			<div className="control-buttons">
				<form onSubmit={handleSearchResult} >
					<input className='itemname' type="text" placeholder='search by name' />
					<input type="submit" />
				</form>
				<button onClick={ () => navigate( '/filter' ) }><FaFilter /></button>
				<button onClick={ handleOrderButton }>Order</button>
				<button onClick={()=> navigate('/')} >Log Out</button>

			</div>

			<div className="order-form-container">
				<form className='order-form' onSubmit={ addRequestHandler }>
					<input type="text" name="employeename" placeholder='Employee Name' />
					<input type="text" placeholder='Item Name' name='itemname' required/>
					<label>Unit of measurement :
						<select name="unitofmeasurement">
							<option value="piece">Piece</option>
						</select>
					</label>
					<input type="number" name="quantity"  placeholder='quantity' required/>
					<input type="number" name='pricewithoutvat' placeholder='Price without VAT' required/>
					<textarea name="comment" cols="30" rows="3" placeholder='add your comment' ></textarea>
					<button className='add-order' >Add To Request</button>
				</form>
				<button className='submit-order' onClick={submitRequestHandler}>Submit</button>
				<button className='cancel-order' onClick={handleCancelButton}>Cancel</button>
			</div>


			<div className="goods">
				<table>
						<thead>
							<tr>
								<th onClick={SortItemByHeaders} data-name='itemid'>Item ID  <FaSort/></th>
								<th onClick={SortItemByHeaders} data-name='itemname'>Item Name  <FaSort/></th>
								<th onClick={ SortItemByHeaders } data-name='itemgroup'>Item Group  <span><FaSort /></span></th>
								<th onClick={SortItemByHeaders} data-name='unitofmeasurement'>Unit of Measurement  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='quantity'>Quantity  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='pricewithoutvat'>Price Without VAT  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='status'>Status  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='storagelocation'>Storage Location  <span><FaSort/></span></th>
								<th onClick={SortItemByHeaders} data-name='contactperson'>Contact Person  <span><FaSort/></span></th>
								<th >Photo  </th>
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