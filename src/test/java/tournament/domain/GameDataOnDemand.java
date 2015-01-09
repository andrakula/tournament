package tournament.domain;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.roo.addon.dod.RooDataOnDemand;
import org.springframework.stereotype.Component;
import tournament.repository.GameRepository;

@Component
@Configurable
@RooDataOnDemand(entity = Game.class)
public class GameDataOnDemand {

	private Random rnd = new SecureRandom();

	private List<Game> data;

	@Autowired
    TeamDataOnDemand teamDataOnDemand;

	@Autowired
    GameRepository gameRepository;

	public Game getNewTransientGame(int index) {
        Game obj = new Game();
        setGoals1(obj, index);
        setGoals2(obj, index);
        setPlayed(obj, index);
        setTeam1(obj, index);
        setTeam2(obj, index);
        return obj;
    }

	public void setGoals1(Game obj, int index) {
        Integer goals1 = new Integer(index);
        obj.setGoals1(goals1);
    }

	public void setGoals2(Game obj, int index) {
        Integer goals2 = new Integer(index);
        obj.setGoals2(goals2);
    }

	public void setPlayed(Game obj, int index) {
        Date played = new GregorianCalendar(Calendar.getInstance().get(Calendar.YEAR), Calendar.getInstance().get(Calendar.MONTH), Calendar.getInstance().get(Calendar.DAY_OF_MONTH), Calendar.getInstance().get(Calendar.HOUR_OF_DAY), Calendar.getInstance().get(Calendar.MINUTE), Calendar.getInstance().get(Calendar.SECOND) + new Double(Math.random() * 1000).intValue()).getTime();
        obj.setPlayed(played);
    }

	public void setTeam1(Game obj, int index) {
        Team team1 = teamDataOnDemand.getRandomTeam();
        obj.setTeam1(team1);
    }

	public void setTeam2(Game obj, int index) {
        Team team2 = teamDataOnDemand.getRandomTeam();
        obj.setTeam2(team2);
    }

	public Game getSpecificGame(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Game obj = data.get(index);
        BigInteger id = obj.getId();
        return gameRepository.findOne(id);
    }

	public Game getRandomGame() {
        init();
        Game obj = data.get(rnd.nextInt(data.size()));
        BigInteger id = obj.getId();
        return gameRepository.findOne(id);
    }

	public boolean modifyGame(Game obj) {
        return false;
    }

	public void init() {
        int from = 0;
        int to = 10;
        data = gameRepository.findAll(new org.springframework.data.domain.PageRequest(from / to, to)).getContent();
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Game' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Game>();
        for (int i = 0; i < 10; i++) {
            Game obj = getNewTransientGame(i);
            try {
                gameRepository.save(obj);
            } catch (final ConstraintViolationException e) {
                final StringBuilder msg = new StringBuilder();
                for (Iterator<ConstraintViolation<?>> iter = e.getConstraintViolations().iterator(); iter.hasNext();) {
                    final ConstraintViolation<?> cv = iter.next();
                    msg.append("[").append(cv.getRootBean().getClass().getName()).append(".").append(cv.getPropertyPath()).append(": ").append(cv.getMessage()).append(" (invalid value = ").append(cv.getInvalidValue()).append(")").append("]");
                }
                throw new IllegalStateException(msg.toString(), e);
            }
            data.add(obj);
        }
    }
}
