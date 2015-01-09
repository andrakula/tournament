package tournament.domain;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.roo.addon.dod.RooDataOnDemand;
import org.springframework.stereotype.Component;
import tournament.repository.TeamRepository;

@Configurable
@Component
@RooDataOnDemand(entity = Team.class)
public class TeamDataOnDemand {

	private Random rnd = new SecureRandom();

	private List<Team> data;

	@Autowired
    TeamRepository teamRepository;

	public Team getNewTransientTeam(int index) {
        Team obj = new Team();
        setGames(obj, index);
        setName(obj, index);
        setPoints(obj, index);
        return obj;
    }

	public void setGames(Team obj, int index) {
        Integer games = new Integer(index);
        obj.setGames(games);
    }

	public void setName(Team obj, int index) {
        String name = "name_" + index;
        obj.setName(name);
    }

	public void setPoints(Team obj, int index) {
        Integer points = new Integer(index);
        obj.setPoints(points);
    }

	public Team getSpecificTeam(int index) {
        init();
        if (index < 0) {
            index = 0;
        }
        if (index > (data.size() - 1)) {
            index = data.size() - 1;
        }
        Team obj = data.get(index);
        BigInteger id = obj.getId();
        return teamRepository.findOne(id);
    }

	public Team getRandomTeam() {
        init();
        Team obj = data.get(rnd.nextInt(data.size()));
        BigInteger id = obj.getId();
        return teamRepository.findOne(id);
    }

	public boolean modifyTeam(Team obj) {
        return false;
    }

	public void init() {
        int from = 0;
        int to = 10;
        data = teamRepository.findAll(new org.springframework.data.domain.PageRequest(from / to, to)).getContent();
        if (data == null) {
            throw new IllegalStateException("Find entries implementation for 'Team' illegally returned null");
        }
        if (!data.isEmpty()) {
            return;
        }
        
        data = new ArrayList<Team>();
        for (int i = 0; i < 10; i++) {
            Team obj = getNewTransientTeam(i);
            try {
                teamRepository.save(obj);
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
