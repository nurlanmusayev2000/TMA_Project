import { useNavigate } from "react-router-dom";
export const Login = () =>{
	const navigate=useNavigate()



	const checkLoginDetails=async (e)=>{
		e.preventDefault()
		const formdata=new FormData(e.target);
		const dataOfForm = Object.fromEntries( formdata )
		console.log(dataOfForm);
		try {
				const response = await fetch('http://localhost:3005/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataOfForm),
				} );
				console.log('res',response);
			if (response.ok && response.url==='http://localhost:3005/coordinatorpanel') {
				navigate('/logged')
			}else if(response.ok && response.url==='http://localhost:3005/employeepanel'){
				navigate('/employee/logged')
			}	else
			{
				alert('username or password are incorrect')
			}
		} catch (error) {
			alert('username or password are incorrect')
			console.log(error);
		}
	}
	return (
		<form className="login-form" onSubmit={checkLoginDetails}>
			<input type="text" placeholder="username" name="username" />
			<input type="password" placeholder="password" name="password" />
			<input type="submit" />
		</form>
	)
}