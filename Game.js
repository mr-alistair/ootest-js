class Game {
    
    g_movecounter = 1; 

	g_movelog = [];

	g_playerturn = 0;

	g_players = [];
		
    g_dievalue = 0;

	g_gameover = false;

	constructor(x_id) {

		this.g_movecounter = 0;

		this.g_playerturn = this.g_return_random(2);
		
		this.g_logmove("Player " + this.g_playerturn + " will go first."); 

		this.g_dievalue = 0;

		this.g_gameover = false;

		this.g_newgame(); 
    }

    g_newgame() {
        this.g_players[1] = new Player(1);

        this.g_logmove("Player 1 created.");

        this.g_players[2] = new Player(2);

        this.g_logmove("Player 2 created.");

    }

    g_get_playerturn() {
		return this.g_playerturn;
	}

    g_flip_player() {
		if (this.g_playerturn == 1) {
			this.g_playerturn = 2;
		}
		else
		{
			this.g_playerturn = 1;

		}
	}

    g_return_other_player() {


		if (this.g_playerturn == 1) {

			return this.g_players[2];
		}
		else
		{
			return this.g_players[1];
		}

	}

	g_diceroll() {

		this.g_dievalue = this.g_return_random(6);
		
		return this.g_dievalue;
	}


	g_return_player(x_playerid) {
		return this.g_players[x_playerid];
    }
    
    g_displaylog()
	{
		var x_counter = 0;

		for (x_counter = 0; x_counter <= this.g_movecounter-1; x_counter++)
		{
			document.write((this.g_movelog[x_counter] + "<br>"));
		}

	}	
	
	g_return_random(g_upper){
        return (Math.floor(Math.random() * g_upper) + 1)

        }

    g_logmove(x_logmove)
	{
		
        var x_movecounter = this.g_movecounter;
        
        var x_date = new Date();
        var x_timestamp = x_date.toLocaleTimeString();
		
		this.g_movelog[x_movecounter] = (x_timestamp + " -- " + x_logmove);

		//document.write("<br>" + this.g_movelog[x_movecounter]);
		//console.log(x_timestamp + " -- " + x_logmove);
		
		this.g_movecounter++;


		
	}

	g_move_onto_board_set_D(x_player)
	{

		var x_piece_pointer = this.g_find_to_move_onto_board(x_player);

		if (x_piece_pointer == 0)
		{
			//no more pieces to move on to the board
			var x_logstring = "Player " + x_player.p_get_playerid()  + " did not have pieces to move into play.";
		
			this.g_logmove(x_logstring);

			return false;

			}

			else

			{
				this.g_marker_move(x_player.p_get_playerid(), x_piece_pointer);
								
				return true;
			}
		}

	g_find_to_move_onto_board(x_player) {

			var x_piece_array_pointer = [0,0,0,0,0];
			
			var x_counter_array = 0;
	
			var x_counter = 0;
	
			for (x_counter = 1; x_counter <= 4; x_counter++) 
			{
	
				if (x_player.p_pieces[x_counter].m_get_location() == 1) {
		
					x_piece_array_pointer[++x_counter_array] = x_counter;
	
				}
	
			}
	
			//If there is one or more, return one at random
			if (x_counter_array > 0) {
	
				x_counter = this.g_return_random(x_counter_array);
	
				return x_piece_array_pointer[x_counter];
			}
			else
			{
				//there were no markers 'off the board'...return an empty pointer;
	
				var x_movelog = "Player " +  x_player.p_get_playerid() + " was in SET D but could not find markers.";
				this.g_logmove(x_movelog);
	
				return 0;
			}
		}

	g_marker_move(x_playerid, x_piece_pointer)
		{
			var x_logstring = "";
		
			var x_text = "";
		
			var x_old_position = 0;
		
			var x_new_location = 0;
			
			var x_other_player = this.g_return_other_player();
		
			x_old_position = this.g_players[x_playerid].p_pieces[x_piece_pointer].m_get_location();
		
					
			if (this.g_dievalue != 0)
			{
			
				x_new_location = this.g_players[x_playerid].p_pieces[x_piece_pointer].m_calclocation(this.g_dievalue);
				document.write("Moved to " + x_new_location + "<br>");
			}
		
			else
		
			{
				//Piece has been bumped to the start either due to clash or blow-out
				x_new_location = 1;
			}
		
			if (x_new_location > 120)
			{
				//blow-out!
				
				x_logstring = "Player " + x_playerid + " busted piece " + x_piece_pointer + " to a value of " + x_new_location + "!";
		
				this.g_logmove(x_logstring);
		
				x_new_location = 1;
		
			}
		
			
			this.g_players[x_playerid].p_pieces[x_piece_pointer].m_setlocation(x_new_location);
		
			x_logstring = "[[[Player " + x_playerid  + " moved piece " + x_piece_pointer + " from position " + x_old_position + " to " + this.g_players[x_playerid].p_pieces[x_piece_pointer].m_get_location()  + "]]]";
		
			this.g_logmove(x_logstring);
		
			//call clash detect unless it has moved to 1
		
			if (x_new_location == 120)
			{
				//piece has made it to the end and will be disabled
		
				if (this.g_players[x_playerid].p_pieces[x_piece_pointer].m_get_status())
				{
					x_text = "ACTIVE";
		
				}
		
				else
		
				{
					x_text = "INACTIVE";
		
				}
		
				x_logstring = "Player " + x_playerid + "s piece " + x_piece_pointer + " has reached position " + this.g_players[x_playerid].p_pieces[x_piece_pointer].m_get_location()  + " successfully and is now " + x_text;
		
				this.g_logmove(x_logstring);
		
				}
		
		
			if (x_new_location != 1 && x_new_location != 120)
			{
		
					this.g_detect_clash(this.g_players[x_playerid].p_pieces[x_piece_pointer].m_get_location(), x_other_player);
				
			}
		
			
			this.g_gameover = this.g_players[x_playerid].p_check_game_status(this.g_players[x_playerid]);
		
			
		}
		
	g_detect_clash(x_location, x_player) {

				//iterate through opposing players active pieces and reset them if the new move has caused a clash
			
				var x_logstring = "";

				var x_counter = 0;
				
				var x_return_flag = false;
			
			
				for (x_counter = 1; x_counter <= 4; x_counter++) {
			
					//find an (opposition) player's marker which is on the board but active
			
					if (x_player.p_pieces[x_counter].m_get_location() == x_location && x_player.p_pieces[x_counter].m_get_status())
					{
			
						//bump the clash piece
			
						this.g_dievalue = 0;
			
						this.g_marker_move(x_player.p_get_playerid(), x_counter);

						x_logstring = "Player "  + x_player.p_get_playerid() + "'s piece " + x_counter + " was bumped to the start of the board!"
			
						this.g_logmove(x_logstring);
						
						x_return_flag = true;
			
					} //if it doesn't find a clash, do nothing
			
				}
			
				return x_return_flag;
		}

	g_find_to_move_in_play(x_player)
		{
		
			var x_piece_array_pointer = [];
			var x_counter_loop_b = 0;
			var x_counter_loop_d = 0;
			var x_counter_loop_c = 0;
			var x_counter_b = 0;
			var x_piece_array_backup = [];
			var x_counter_array = 0;
			var x_counter_loop_a = 0;
			var x_temp_value = 0;
			var x_counter_a = 0;
			var x_logstring = "";
			var x_temp_magic_numbers = [20,24,30,40,60];
			var x_test_1 = false;
			var x_test_2 = false;
				
			x_piece_array_pointer.push(0);

			for (x_counter_a = 1; x_counter_a <= 4; x_counter_a++)
			{
				//find a player's marker which is active
		
				if (x_player.p_pieces[x_counter_a].m_get_status())
		
				{
					x_counter_array++;
		
					x_piece_array_pointer.push(x_counter_a); 
					//console.log("Pushing piece " + x_counter_a + " into array.");
		
				}
			}	
			
			//copy array
			var x_piece_array_backup = x_piece_array_pointer.slice();
			
			//If there is one or more, return one at random
			if (x_counter_array > 0)
			{
				x_logstring = "Considering between " + x_counter_array + " potential piece(s).";
	
				this.g_logmove(x_logstring);
		
				for (x_counter_loop_a = 1; x_counter_loop_a <= x_counter_array; x_counter_loop_a++)
				{
					x_test_1 = false;
			
					x_test_2 = false;
			
					x_temp_value = x_piece_array_pointer[x_counter_loop_a];
			
					x_logstring = "Step " + x_counter_loop_a + " of " + x_counter_array + "..Looking at piece: " + x_temp_value + " at location " + x_player.p_pieces[x_temp_value].m_get_location();
			
					this.g_logmove(x_logstring);
						
					x_test_1 = x_temp_magic_numbers.includes(x_player.p_pieces[x_temp_value].m_get_location());
						
					if (x_test_1)
					{
						this.g_logmove("Considering ignoring piece " + x_temp_value + " as it is on a penultimate number.");
					}
			
					if ((x_player.p_pieces[x_temp_value].m_get_location() * this.g_dievalue) > 120)
					{
						x_test_2 = true;
			
						this.g_logmove("Considering ignoring piece " + x_temp_value + " as it may cause a blowout.");
			
					}
			
					if (x_test_1 || x_test_2)
					{
						//one of these is a 'good' number we wish to avoid moving randomly, or could cause a blow-out
			
						x_piece_array_backup[x_counter_loop_a] = 999;
					}
			
				} //end for
		
				//find the number of pieces in the backup array
		
				for(x_counter_loop_b = 1; x_counter_loop_b <= 4; x_counter_loop_b++)
				{
					if (x_piece_array_backup[x_counter_loop_b] != 999 && x_piece_array_backup[x_counter_loop_b] > 0)
					{
						x_counter_b++;
					}
				}
		
		
					//pick a pointer at random from the remainder    
				if (x_counter_b == 0)
				{
					x_temp_value = 0;
		
					this.g_logmove("Ignored too many...reverting."); //must choose a random from the remaining 'good' pointers 
		
					for (x_counter_loop_c = 1; x_counter_loop_c <= 4; x_counter_loop_c++)
					{
						if (x_piece_array_pointer[x_counter_loop_c] != 999 && x_piece_array_pointer[x_counter_loop_c] > 0)
						{ 
							x_temp_value++;
						}
					}
		
					this.g_logmove("Player " + x_player.p_get_playerid() + " has " + x_temp_value + " possible piece(s) to move which are on the board.");
		
					x_test_1 = true;
		
					while (x_test_1)
					{
						x_counter_array = this.g_return_random(4);
		
						if (x_piece_array_pointer[x_counter_array] > 0 && x_piece_array_pointer[x_counter_array] != 999)
						{
							x_test_1 = false; //found one to move
						}
		
					} //end while
		
				}
				else
				{  //pick one from the backup array to use
					x_temp_value = 0;
		
					for (x_counter_loop_d = 1; x_counter_loop_d <= 4; x_counter_loop_d++)
					{
						if (x_piece_array_backup[x_counter_loop_d] != 999 && x_piece_array_backup[x_counter_loop_d] > 0)
						{
							x_temp_value++;
						}
					}
		
					this.g_logmove("Choosing one from the remaining markers..."); //must choose a random from the remaining 'good' pointers 
		
					this.g_logmove("Player " + x_player.p_get_playerid() + " has " + x_temp_value + " possible piece(s) to move which are on the board.");
		
					x_test_1 = true;
		
					while (x_test_1)
					{
						x_counter_array = this.g_return_random(4);
		
						if (x_piece_array_pointer[x_counter_array] > 0 && x_piece_array_pointer[x_counter_array] != 999)
						{
							x_test_1 = false; //found one to move
						}
		
					}
		
				}
		
				this.g_logmove("Player " + x_player.p_get_playerid()  + " has chose to move " + x_piece_array_pointer[x_counter_array]);
		
			}
			else
			{
		
			//there were no markers 'on the board'...return an empty pointer;
			//this is captured by the calling function and acted upon        
	
				return 0;

			}
		
			return(x_piece_array_pointer[x_counter_array]);
		
		} //end of function
		
	g_player_action(x_playerid) {

		//properties
		var x_result = false;
	
		var x_test = 0;
	
		var x_temp_return = "";
					
		var x_temp_magic_numbers =  [0, 20, 24, 30, 40, 60, 120];
	
		var x_temp_factor_numbers = [0, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 25, 50];
	
		var x_logstring = "";
	
		this.g_dievalue = this.g_diceroll();
	
		x_logstring = "[[[Player " + x_playerid + " rolled a " + this.g_dievalue + " ]]]";
	
		this.g_logmove(x_logstring);
	
	
	
			if (this.g_dievalue == 1) {
	
				this.g_logmove("Player " + x_playerid  + " has to forfeit their move!");
	
			}
			else
			{
	
				//SET A
	
				x_result = this.g_target_magic_numbers(x_playerid, x_temp_magic_numbers, "penultimate",6);
					
				if (x_result)
				{
					x_temp_return = "TRUE";
				}
				else {
					x_temp_return = "FALSE";
				}
	
				//SET B
				if (!x_result)
				{
					this.g_logmove("Player " + x_playerid + " did not find any penultimate targets.");
	
	
						x_result = this.g_target_magic_numbers(x_playerid, x_temp_factor_numbers, "factor", 12);
					
	
					if (x_result)
					{
						x_temp_return = "TRUE";
					}
					else { 
						x_temp_return = "FALSE";
					}
	
	
				}
	
				//SET C
				if (!x_result)
				{
					//call function C here, return TRUE if it triggers successfully
	
					this.g_logmove("Player " + x_playerid + " did not find any factor targets.");
	
					x_result = this.g_target_potential_clashes_set_C(this.g_players[x_playerid]);
	
	
					if (x_result)
					{
						x_temp_return = "TRUE";
					}
					else {
						x_temp_return = "FALSE";
					}
	
	
					
	
				}
	
				//SET D
				if (!x_result)
				{
	
					x_result = this.g_move_onto_board_set_D(this.g_players[x_playerid]);
	
					if (x_result)
					{
						x_temp_return = "TRUE";
					}
					else {
						x_temp_return = "FALSE";
					}
	
					
	
				
				}
	
			}
	
			if (this.g_gameover)
			{
				document.write("**************************************<br>");
	
				document.write("***   Player " + x_playerid + " HAS WON THE MATCH! ***<br>");
	
				document.write("**************************************<br>");
	
				this.g_logmove("************************************");
	
				this.g_logmove("***   Player " + x_playerid + " HAS WON THE MATCH! ***");
	
	
				this.g_logmove("************************************");
	
			}
	
			return this.g_gameover;
	
	
		}
		
	g_target_magic_numbers(x_playerid, x_magicnumbers, x_type, x_magic_count)
		{
	
			//properties
			var x_forecast_pointers = [];
			var x_forecast_internal = [];
			var x_found_target = false;
			var x_test_count_flag = false;
			var x_piece_pointer = 0;
			var x_counter = 0;
			var x_counter_m = 0;
			var x_counter_test = 0;
			var x_temp_forecast = 0;
					
			//populate current players positions and status to temporary array
			x_forecast_internal = [0,0,0];
			x_forecast_pointers.push(x_forecast_internal);
			
			for (x_counter = 1; x_counter <= 4; x_counter++)
			{
				//HERE
				if (!this.g_players[x_playerid].p_pieces[x_counter].m_get_status())
					
				{
					//this piece is out of play - set up a dummy which will never get hit
					//up to here, need to PUSH array values to set up 2 dim nestted array TODO TO DO TO DO

					x_forecast_internal = [x_counter,999,0];

					x_forecast_pointers.push(x_forecast_internal);
					
				}
	
				else
	
				{
					//otherwise, put in a forecast of where it would land based on the dice roll
	
					x_forecast_internal = [x_counter,(this.g_players[x_playerid].p_pieces[x_counter].m_get_location() * this.g_dievalue),0];

					x_forecast_pointers.push(x_forecast_internal);
					
				}
			}
	
	
			//now for each potential location see if there is a match in magic numbers
			for (x_counter_m = 1; x_counter_m <= 4; x_counter_m++)
			{
				x_temp_forecast = x_forecast_pointers[x_counter_m][1];
	
				for (x_counter = 1; x_counter <= x_magic_count; x_counter++) //iterate through magic numbers to see if there is a match
				{
									
					if (x_magicnumbers[x_counter] == x_temp_forecast)
					{ //found one
						x_forecast_pointers[x_counter_m][2] = 1;
						x_counter = 999;
					
					}
	
				}
	
				//clear the array of player's pieces that are not a likely hit
				x_test_count_flag = false;
	
				for (x_counter_test = 1; x_counter_test <= 4; x_counter_test++)
				{
					if (x_forecast_pointers[x_counter_test][2] == 1)
					{
						//found at least one
						x_test_count_flag = true;
	
					}
	
					else
	
					{
						x_forecast_pointers[x_counter_test][2] = 999;
	
					}
				}
	
	
				//got at least one potential target
				if (x_test_count_flag)
				{
	
					//now we have an array of only the possible markers to select to target
					//loop until we find one that is not 999
	
					while (!x_found_target)
					{
						x_counter = this.g_return_random(4);
	
						if (x_forecast_pointers[x_counter][2] != 999)
						{
							//the piece we choose to move
							x_piece_pointer = x_forecast_pointers[x_counter][0];
	
							this.g_logmove("Player " + x_playerid + " is targeting " + x_type + " number " + x_forecast_pointers[x_counter][1] + " with piece " + x_piece_pointer);
	
							this.g_marker_move(x_playerid,  x_piece_pointer);
							//here??
	
							x_found_target = true;
						
	
						}
					}
				}
	
				else
	
				{
					x_found_target = false;
	
				}
	
	
			} //END OF SET B
	
			return x_found_target;
		}
		
			
	g_target_potential_clashes_set_C(x_player) {

			//properties
			var x_forecast_pointers = [];
			var x_forecast_internal = [];
			var x_found_target = false;
			var x_test_count_flag = false;
			var x_piece_pointer = 0;
			var x_temp_branch = 2;
			var x_counter = 0;
			var x_counter_o = 0;
			var x_counter_p = 0;
			var x_counter_test = 0;
			var x_temp_opp_location = 0;
			var x_temp_opp = this.g_return_other_player();
			var x_offboard_flag = false;
			var x_onboard_flag = false;
	
	
			//populate current players positions and status to temporary array
			x_forecast_internal = [0,0,0];
			x_forecast_pointers.push(x_forecast_internal);
			
			for (x_counter = 1; x_counter <= 4; x_counter++)
			{
	
			if (!x_player.p_pieces[x_counter].m_get_status())
				{
					//this piece is out of play - set up a dummy which will never get hit
	
					x_forecast_internal = [x_counter,999,0];
					x_forecast_pointers.push(x_forecast_internal);
					
				}
	
				else
	
				{
					//otherwise, put in a forecast of where it would land based on the dice roll
	
					x_forecast_internal = [x_counter,(x_player.p_pieces[x_counter].m_get_location() * this.g_dievalue),0];
					
					x_forecast_pointers.push(x_forecast_internal);
					
				}
			}
	
	
			//now for each potential location see if there is a match in the opponent's pieces
	
			for (x_counter_o = 1; x_counter_o <= 4; x_counter_o++)
			{
	
				if (!x_temp_opp.p_pieces[x_counter_o].m_get_status())
	
				{
					//opp position is out of play and should be ignored -  dummy value
					this.g_logmove("Ignoring target piece " + x_counter_o + " as it is out of play.");
	
					x_temp_opp_location = 888;
				}
	
				else
	
				{
					//hold the location of a potential target piece to hit
					x_temp_opp_location = x_temp_opp.p_pieces[x_counter_o].m_get_location();
					
				}
	
				for (x_counter_p = 1; x_counter_p <= 4; x_counter_p++)
				{
					//check that the locations match and that the opponents piece  is not at the start, or inactive:
	
					if (x_forecast_pointers[x_counter_p][1] == x_temp_opp_location && x_temp_opp_location != 1 && x_temp_opp_location != 888)
	
					{
						//we have a potential target
						x_forecast_pointers[x_counter_p][2] = 1;
	
						this.g_logmove("Player " + x_temp_opp.p_get_playerid() + "'s marker " + x_counter_o + " at location " + x_temp_opp.p_pieces[x_counter_o].m_get_location()  + " is a target of piece " + x_counter_p);
	
						//don't even know if this works in c++
						break; //we only need to know this once         
	
					}
	
				} //move on to next player piece
	
			} //move on to next opponent piece
	
	
			//clear the array of player's pieces that are not a likely hit
			x_test_count_flag = false;
	
			for (x_counter_test = 1; x_counter_test <= 4; x_counter_test++)
			{
				if (x_forecast_pointers[x_counter_test][2] == 1)
				{
					//found at least one
					x_test_count_flag = true;
	
				}
	
				else
	
				{
					x_forecast_pointers[x_counter_test][0] = 999;
				}
			}
	
	
			//got at least one potential target
			if (x_test_count_flag)
			{
				x_counter = 0;
	
				while (!x_found_target)
				{
					x_counter = this.g_return_random(4);
	
					if (x_forecast_pointers[x_counter][0] != 999)
					{
	
						x_piece_pointer = x_forecast_pointers[x_counter][0];
	
						this.g_logmove("Player " + x_player.p_get_playerid() + " has targets to consider and chose to move piece " + x_piece_pointer);
	
						this.g_marker_move(x_player.p_get_playerid(), x_piece_pointer);
	
						x_found_target = true;
	
						return x_found_target;
					}
				}
			}
	
			else
	
			{
				this.g_logmove("Player " + x_player.p_get_playerid() + " could not find a clash target so is going to find a pointer at random to move.");
	
				//toss up between on or off board
				x_offboard_flag = false;
	
				x_onboard_flag = false;
	
				for (x_counter = 1; x_counter <= 4; x_counter++)
				{
					//loop and see if there is a mix of on-board or off-board marker; do a coin toss if there is
					if (x_player.p_pieces[x_counter].m_get_location() == 1 && x_player.p_pieces[x_counter].m_get_status())
					{
						x_offboard_flag = true;  //we could get a piece off the board
					}
	
					if (x_player.p_pieces[x_counter].m_get_location() > 1 && x_player.p_pieces[x_counter].m_get_status())
					{
						x_onboard_flag = true;  // we could get a piece on the board
					}
	
				}
	
				if (x_onboard_flag)
				{
	
					if (x_offboard_flag)
					{
	
						//choice is a wonderful thing - 1 is on-board, 2 is off-board
						x_temp_branch = this.g_return_random(2);
	
					}
					else
	
						x_temp_branch = 1;
	
				}
	
				if (x_temp_branch == 1)
				{
	
					x_piece_pointer = 0;
	
					this.g_logmove("Finding a piece on the board.");
	
					x_piece_pointer = this.g_find_to_move_in_play(x_player);
	
					if (x_piece_pointer != 0)
					{
						//found one... move it        
	
						this.g_marker_move(x_player.p_get_playerid(), x_piece_pointer);
	
						x_found_target = true;
	
					}
	
					else
	
					{
	
						//didn't find one, have to force to go down the SET D path.
	
						x_temp_branch = 0;
	
						x_found_target = false;
	
					}
				}
	
				if (x_temp_branch == 0)
				{
	
					x_found_target = false;
	
					this.g_logmove("Finding a piece OFF the board using SET D.");
				}
	
	
			}
			
			return x_found_target;
	
		} //END OF SET C
	
	

}

	

	
	