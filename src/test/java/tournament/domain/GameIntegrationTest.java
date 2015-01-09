package tournament.domain;
import java.math.BigInteger;
import java.util.Iterator;
import java.util.List;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.roo.addon.test.RooIntegrationTest;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import tournament.repository.GameRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:/META-INF/spring/applicationContext*.xml")
@Configurable
@RooIntegrationTest(entity = Game.class, transactional = false)
public class GameIntegrationTest {

    @Test
    public void testMarkerMethod() {
    }

	@Autowired
    GameDataOnDemand dod;

	@Autowired
    GameRepository gameRepository;

	@Test
    public void testCount() {
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", dod.getRandomGame());
        long count = gameRepository.count();
        Assert.assertTrue("Counter for 'Game' incorrectly reported there were no entries", count > 0);
    }

	@Test
    public void testFind() {
        Game obj = dod.getRandomGame();
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", obj);
        BigInteger id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Game' failed to provide an identifier", id);
        obj = gameRepository.findOne(id);
        Assert.assertNotNull("Find method for 'Game' illegally returned null for id '" + id + "'", obj);
        Assert.assertEquals("Find method for 'Game' returned the incorrect identifier", id, obj.getId());
    }

	@Test
    public void testFindAll() {
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", dod.getRandomGame());
        long count = gameRepository.count();
        Assert.assertTrue("Too expensive to perform a find all test for 'Game', as there are " + count + " entries; set the findAllMaximum to exceed this value or set findAll=false on the integration test annotation to disable the test", count < 250);
        List<Game> result = gameRepository.findAll();
        Assert.assertNotNull("Find all method for 'Game' illegally returned null", result);
        Assert.assertTrue("Find all method for 'Game' failed to return any data", result.size() > 0);
    }

	@Test
    public void testFindEntries() {
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", dod.getRandomGame());
        long count = gameRepository.count();
        if (count > 20) count = 20;
        int firstResult = 0;
        int maxResults = (int) count;
        List<Game> result = gameRepository.findAll(new org.springframework.data.domain.PageRequest(firstResult / maxResults, maxResults)).getContent();
        Assert.assertNotNull("Find entries method for 'Game' illegally returned null", result);
        Assert.assertEquals("Find entries method for 'Game' returned an incorrect number of entries", count, result.size());
    }

	@Test
    public void testSave() {
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", dod.getRandomGame());
        Game obj = dod.getNewTransientGame(Integer.MAX_VALUE);
        Assert.assertNotNull("Data on demand for 'Game' failed to provide a new transient entity", obj);
        Assert.assertNull("Expected 'Game' identifier to be null", obj.getId());
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
        Assert.assertNotNull("Expected 'Game' identifier to no longer be null", obj.getId());
    }

	@Test
    public void testDelete() {
        Game obj = dod.getRandomGame();
        Assert.assertNotNull("Data on demand for 'Game' failed to initialize correctly", obj);
        BigInteger id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Game' failed to provide an identifier", id);
        obj = gameRepository.findOne(id);
        gameRepository.delete(obj);
        Assert.assertNull("Failed to remove 'Game' with identifier '" + id + "'", gameRepository.findOne(id));
    }
}
