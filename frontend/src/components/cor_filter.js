import React, { useEffect, useState } from 'react';
import '../FilterFomr.css'; // Import CSS file for styling

const Filter = () => {
	const [filterResult,setFilterResult]=useState()
	const [filteredData,setFilteredData]=useState([])
	const handleSubmit = (e) => {
		e.preventDefault();
		const formdata=new FormData(e.target);
		const dataOfForm = Object.fromEntries( formdata )
		setFilterResult( dataOfForm )


	};

	return (
			<form className="filter-form" onSubmit={handleSubmit}>
					<label>
							Contact Person:
							<input type="text" name="contactperson" />
					</label>
					<label>
							Item Group:
							<select name='itemgroup' id="mySelect">
								<option>Electronic</option>
								<option>Clothing</option>
								<option>Furniture</option>
								<option>Books</option>
							</select>
					</label>
					<label>
							Price (without VAT):
							<input type="number" name="pricewithoutvat"   placeholder='min' />
							-
							<input type="number" name="pricewithoutvat"   placeholder='max'/>
					</label>
					<label>
							Status:
							<select name='status' id="mySelect">
								<option value='available'>Available</option>
								<option value='not available'>Not Available</option>
							</select>
					</label>
					<label>
							Storage Location:
							<input type="text" name="storagelocation"  />
					</label>
					<label>
							Unit of Measurement:
							<select name='unitofmeasurement' id="mySelect">
								<option value='piece'>Piece</option>
							</select>
					</label>
					<button type="submit">Filter</button>
			</form>
	);
};

export default Filter;
