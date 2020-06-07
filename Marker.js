class Marker {
	
	
	constructor(x_id) {
        this.m_owner = x_id;
		this.m_location = 1;
 	}

     m_assignowner (x_owner)
	{
		this.m_owner = x_owner;
	}
	
	m_calclocation( x_diceroll)
	{
		var x_calcvalue = this.m_location * x_diceroll;
		
		return x_calcvalue;
		
	}
	
	m_setlocation( x_newlocation)
	{
		this.m_location = x_newlocation;
			
	}
	
	m_get_location() {

		return this.m_location;

	}
	
	m_get_status() {

		if (this.m_location == 120)
		{
			return false;
		}
		else {
			return true;
		}


	}
	
}
	
	