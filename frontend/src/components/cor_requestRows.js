import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { GiConfirmed } from "react-icons/gi";
import { FaMinusCircle } from "react-icons/fa";


export const RequestRows=()=>{
	const [requestRows,setRequestRows]=useState([])
	const { requestrowid } = useParams();
	const navigate = useNavigate();

		useEffect(()=>{
 			const fetchData = async () => {
            try {
							const response = await fetch(`http://localhost:3005/requestsrow/${requestrowid}`);
							const requests = await response.json();
							console.log(requests);
							setRequestRows( requests );

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
	}, [requestrowid] )

	const handleConfirmButton=async (e)=>{
try {
    const reqId = e.currentTarget.dataset.requestid;
    const reqRowId = e.currentTarget.dataset.requestrowid;
    const itemid = e.currentTarget.dataset.itemid;
    const quantity = e.currentTarget.dataset.quantity;

    const requestData = {
        quantity: quantity
    };

    const response = await fetch(`http://localhost:3005/confirm/request/${reqRowId}/${reqId}/${itemid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    });

    if (response.ok) {
        alert('Request confirmed successfully');
    } else {
        alert('Failed to confirm request');
	}
	window.location.reload();
		} catch (error) {
				console.log(error);
		}
	}
	const handleRejectButton= async(e)=>{
		try {
			const reqId = e.currentTarget.dataset.requestid;
			const reqRowId = e.currentTarget.dataset.requestrowid;
			const response = await fetch( `http://localhost:3005/delete/request/${ reqId }/${ reqRowId }`, {
				method: 'DELETE',
				headers: {
				'Content-Type': 'application/json'
				}
			} );
			if (response.ok) {
				alert( 'request rejected succesfully' );
				window.location.reload()

			}
		} catch (error) {
			console.log(error);
		}


	}

	const table_body = requestRows?.map( request =>
		<tr  data-requestrowid={request.requestrowid} data-id={request.requestid} key={request.requestid}>
			<td >{ request.itemid}</td>
			<td >{ request.requestid}</td>
			<td >{ request.itemname}</td>
			<td>{ request.unitofmeasurement }</td>
			<td>{ request.quantity }</td>
			<td>{ request.pricewithoutvat }</td>
			<td>{ request.comment }</td>
			<td>{ request.requestrowid }</td>
			<td data-requestid={request.requestid} data-requestrowid={request.requestrowid} onClick={handleConfirmButton} data-itemid={request.itemid} data-quantity={request.quantity} className="confirm"><GiConfirmed /></td>
			<td data-requestid={request.requestid} data-requestrowid={request.requestrowid}  onClick={handleRejectButton} className="reject"><FaMinusCircle /></td>
		</tr>
	);


	return (
		<div className="container">
				<div className="control-buttons">
					<button onClick={ () => navigate( '/coordinator/requestlist' ) }>Requests List</button>
					<button onClick={()=> navigate('/')} >Log Out</button>
				</div>
				<div className="goods">
					<table>
							<thead>
								<tr>
									<th  data-name='itemid'>Item ID  </th>
									<th  data-name='requestid'>Request ID </th>
									<th  data-name='itemname'>Item Name </th>
									<th  data-name='unitofmeasurement'>Unit of Measurement </th>
									<th  data-name='quantity'>Quantity  </th>
									<th  data-name='pricewithoutvat'>Price Without VAT  </th>
									<th  data-name='comment'>Comment </th>
									<th  data-name='requestrowid'>Request row id </th>
									<th  >Confirm </th>
									<th  >Reject </th>
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