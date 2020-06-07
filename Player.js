class Player {
    
    
	constructor(x_id) {

        var x_counter = 0;

        this.p_playerid = x_id;
        this.p_pieces = [];
        
        for (x_counter = 0; x_counter <= 4; x_counter++)
		{
            this.p_pieces.push(new Marker(x_counter));
		}
    }

	p_assignpiece(x_player)
	{

		x_marker = new Marker(x_player);
		
		return x_marker;
			
	}
	
	p_get_playerid()
	{
		return this.p_playerid;
	}
	
	p_check_game_status(x_player) {

        var x_counter = 0;
        var x_game_over = true;
				
		for (x_counter = 1; x_counter <= 4; x_counter++)
		{
			
			if (x_player.p_pieces[x_counter].m_get_location() != 120)
			{
				
				x_game_over = false;
				
			}
		
		}

		return x_game_over;
	}

}

	

	
	