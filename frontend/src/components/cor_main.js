import {useState,useEffect} from 'react'
import { FaSort } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import {  useNavigate } from 'react-router-dom';
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

const Main =  () =>{
	const [ targetItem, setTargetItem ] = useState();
	const [ listOfGoods, setListOfGoods ] = useState( [] );
	const [ filteredData, setFilteredData ] = useState( [] )
		const [boolean,setBoolean]=useState(false)

	const navigate = useNavigate()
	console.log(listOfGoods);
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
	},[ ])

	const confirmNewItem = async ( e ) =>{
		const form = document.querySelector( '.add-form' );
		const formdata=new FormData(form);
		const dataOfForm = Object.fromEntries( formdata )
		try {
			const response = await fetch('http://localhost:3005/coordinatorpanel/additem', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataOfForm)
			} );
			if (response.ok) {
				alert( 'item added' )
				const form = document.querySelector( '.add-item-form' );
				form.style.display='none'
			}else {
				const errorMessage = await response.text();
				alert(`Failed to add item: ${errorMessage}`);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred while adding the item');
		}

	}
	const handleDeleteItem=async (e)=>{
		const maintarget = e.currentTarget.parentElement;
		const targetItem = maintarget.dataset.id;
		const response = window.confirm( 'if you confirm pushed ok' );
		try {
			if (response) {
				const deleteItem = await fetch( `http://localhost:3005/coordinatorpanel/deleteitem/${ targetItem }`, {
					method: 'DELETE',
					headers: {
					'Content-Type': 'application/json'
					}
				} )
				if(deleteItem.ok){
					alert( 'item deleted succesfully' )
					navigate( '/logged' );
					window.location.reload()
				}else{
					alert('pls try later again')
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	const handleUpdateItem = async(e) =>{
		const itemname = document.addForm.itemname;
		const contactperson = document.addForm.contactperson;
		const itemgroup = document.addForm.itemgroup;
		const unitofmeasurement = document.addForm.unitofmeasurement;
		const quantity = document.addForm.quantity;
		const pricewithoutvat = document.addForm.pricewithoutvat;
		const status = document.addForm.status;
		const storagelocation = document.addForm.storagelocation;
		console.log(itemname);
		const maintarget = e.currentTarget.parentElement;
		const targetItem = maintarget.dataset.id;
		const targetDataArray = listOfGoods.filter( item =>		{
			return item.itemid === parseInt( targetItem )
		} );
		const targetData = targetDataArray[ 0 ];
		console.log(targetData.itemname);
		itemname.value=targetData.itemname ;
		contactperson.value=targetData.contactperson;
		itemgroup.value=targetData.itemgroup;
		unitofmeasurement.value=targetData.unitofmeasurement;
		quantity.value=targetData.quantity;
		pricewithoutvat.value=targetData.pricewithoutvat;
		status.value=targetData.status;
		storagelocation.value=targetData.storagelocation;
		setTargetItem( targetItem )
		const form = document.querySelector( '.add-item-form' );
		const upform = document.querySelector( '.add-form' );
		console.log(form,upform);
		const confirmButton = document.querySelector( '.confirm' );
		const updateButton = document.querySelector( '.update-button' );
		confirmButton.style.display='none'
		updateButton.style.display='block'
		form.style.display = 'block'
	}

	const	confirmUpdate=async ()=>{
			const upform = document.querySelector( '.add-form' );
			const formdata=new FormData(upform);
			const dataOfForm = Object.fromEntries( formdata );
			const convertedData=JSON.stringify(dataOfForm)
			const response = window.confirm( 'if you confirm pushed ok' );
			try {
			if (response) {
				const updateItem = await fetch( `http://localhost:3005/coordinatorpanel/updateitem/${ targetItem }`, {
					method: 'PUT',
					headers: {
					'Content-Type': 'application/json'
					},
					body:convertedData
				} )
				if(updateItem.ok){
					alert( 'item updated succesfully' )
					navigate( '/logged' );
					window.location.reload()
				}else{
					alert('pls try later again')
				}
			}
		} catch (error) {
			console.log(error);
		}
		}
	const table_body = filteredData?.map( item =>
		<tr data-id={item.itemid} key={item.itemid}>
			<td >{ item.itemid}</td>
			<td >{ item.itemname}</td>
			<td>{ item.itemgroup }</td>
			<td>{ item.unitofmeasurement }</td>
			<td>{ item.quantity }</td>
			<td>{ item.pricewithoutvat }</td>
			<td>{ item.status }</td>
			<td>{ item.storagelocation }</td>
			<td>{ item.contactperson }</td>
			<td>{ item.photo }</td>
			<td onClick={handleUpdateItem}><GrUpdate /></td>
			<td onClick={handleDeleteItem}><MdDelete /></td>
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
	<div className="container">
			<div className="control-buttons">
				<form className='search' onSubmit={handleSearchResult}>
					<input  className='itemname' type="text" placeholder='search by name' />
					<input type="submit" />
				</form>
				<button onClick={()=>navigate('/filter')}><FaFilter /></button>
				<button onClick={()=>{
					const form = document.querySelector( '.add-item-form' );
					form.style.display = 'block'
					const confirmButton = document.querySelector( '.confirm' );
					const updateButton = document.querySelector( '.update-button' );
					confirmButton.style.display='block'
					updateButton.style.display = 'none'

				} }>add new item</button>
				<button className='req-list-button' onClick={ () => navigate( '/coordinator/requestlist' ) }>Request List</button>
				<button onClick={()=> navigate('/')} >Log Out</button>
		</div>
		<div className="add-item-form">
				<form className='add-form' name='addForm'>
					<label htmlFor="itemname">Item Name : </label>
					<input type="text" name='itemname' placeholder='item name' />
					<label htmlFor="itemgroup">Item Group : </label>
					<select name='itemgroup' id="mySelect" required>
							<option>Electronic</option>
							<option>Clothing</option>
							<option>Furniture</option>
							<option>Books</option>
					</select>
					<label>
							Unit of Measurement:
							<select name='unitofmeasurement' id="mySelect" required>
								<option value='piece'>Piece</option>
							</select>
					</label>
					<input type="number" name='quantity' placeholder='quantity' min='1' required/>
					<input type="number" name='pricewithoutvat' placeholder='Price without VAT' min='1' required/>
					<label>
						Status:
						<select name='status' id="mySelect" required>
							<option value='available'>Available</option>
							<option value='not available'>Not Available</option>
						</select>
					</label>
					<input type="text" name="storagelocation" placeholder='Storage Location' />
					<input type="text" name="contactperson" placeholder='Contact Person' />
					<button onClick={confirmNewItem} className='confirm'>Confirm </button>
					<button onClick={()=>{
						const form = document.querySelector( '.add-item-form' );
						form.style.display='none'
					} } className='cancel'>Cancel</button>
					<button className='update-button' onClick={confirmUpdate}>Update</button>
				</form>
		</div>

		<div className="goods">
			 <table>
					<thead>
						<tr>
							<th onClick={SortItemByHeaders} data-name='itemid'>Item ID  <FaSort/></th>
							<th onClick={SortItemByHeaders} data-name='itemname'>Item Name  <FaSort/></th>
							<th onClick={SortItemByHeaders} data-name='itemgroup'>Item Group  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='unitofmeasurement'>Unit of Measurement  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='quantity'>Quantity  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='pricewithoutvat'>Price Without VAT  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='status'>Status  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='storagelocation'>Storage Location  <span><FaSort/></span></th>
							<th onClick={SortItemByHeaders} data-name='contactperson'>Contact Person  <span><FaSort/></span></th>
							<th >Photo  </th>
							<th>UPDATE</th>
							<th>DELETE</th>
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

export default Main