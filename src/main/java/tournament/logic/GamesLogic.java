package tournament.logic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tournament.domain.Game;
import tournament.domain.Team;
import tournament.repository.GameRepository;
import tournament.repository.TeamRepository;

@Service
public class GamesLogic {
	
	@Autowired
    GameRepository gameRepository;

	@Autowired
    TeamRepository teamRepository;

	public void saveUndUpdate(Game game) {
		Team team1 = game.getTeam1();
		Team team2 = game.getTeam2();
		
		if (game.getGoals1() > game.getGoals2()){
			team1.setPoints(team1.getPoints()+3);
		}else if (game.getGoals1() < game.getGoals2()) {
			team2.setPoints(team2.getPoints()+3);
		}else{
			team1.setPoints(team1.getPoints()+1);
			team2.setPoints(team2.getPoints()+1);
		}
		
		team1.setGames(team1.getGames()+1);
		team2.setGames(team2.getGames()+1);
		
		gameRepository.save(game);
		teamRepository.save(team1);
		teamRepository.save(team2);
		
	}

}
