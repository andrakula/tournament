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
import tournament.repository.TeamRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:/META-INF/spring/applicationContext*.xml")
@Configurable
@RooIntegrationTest(entity = Team.class, transactional = false)
public class TeamIntegrationTest {

    @Test
    public void testMarkerMethod() {
    }

	@Autowired
    TeamDataOnDemand dod;

	@Autowired
    TeamRepository teamRepository;

	@Test
    public void testCount() {
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", dod.getRandomTeam());
        long count = teamRepository.count();
        Assert.assertTrue("Counter for 'Team' incorrectly reported there were no entries", count > 0);
    }

	@Test
    public void testFind() {
        Team obj = dod.getRandomTeam();
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", obj);
        BigInteger id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Team' failed to provide an identifier", id);
        obj = teamRepository.findOne(id);
        Assert.assertNotNull("Find method for 'Team' illegally returned null for id '" + id + "'", obj);
        Assert.assertEquals("Find method for 'Team' returned the incorrect identifier", id, obj.getId());
    }

	@Test
    public void testFindAll() {
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", dod.getRandomTeam());
        long count = teamRepository.count();
        Assert.assertTrue("Too expensive to perform a find all test for 'Team', as there are " + count + " entries; set the findAllMaximum to exceed this value or set findAll=false on the integration test annotation to disable the test", count < 250);
        List<Team> result = teamRepository.findAll();
        Assert.assertNotNull("Find all method for 'Team' illegally returned null", result);
        Assert.assertTrue("Find all method for 'Team' failed to return any data", result.size() > 0);
    }

	@Test
    public void testFindEntries() {
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", dod.getRandomTeam());
        long count = teamRepository.count();
        if (count > 20) count = 20;
        int firstResult = 0;
        int maxResults = (int) count;
        List<Team> result = teamRepository.findAll(new org.springframework.data.domain.PageRequest(firstResult / maxResults, maxResults)).getContent();
        Assert.assertNotNull("Find entries method for 'Team' illegally returned null", result);
        Assert.assertEquals("Find entries method for 'Team' returned an incorrect number of entries", count, result.size());
    }

	@Test
    public void testSave() {
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", dod.getRandomTeam());
        Team obj = dod.getNewTransientTeam(Integer.MAX_VALUE);
        Assert.assertNotNull("Data on demand for 'Team' failed to provide a new transient entity", obj);
        Assert.assertNull("Expected 'Team' identifier to be null", obj.getId());
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
        Assert.assertNotNull("Expected 'Team' identifier to no longer be null", obj.getId());
    }

	@Test
    public void testDelete() {
        Team obj = dod.getRandomTeam();
        Assert.assertNotNull("Data on demand for 'Team' failed to initialize correctly", obj);
        BigInteger id = obj.getId();
        Assert.assertNotNull("Data on demand for 'Team' failed to provide an identifier", id);
        obj = teamRepository.findOne(id);
        teamRepository.delete(obj);
        Assert.assertNull("Failed to remove 'Team' with identifier '" + id + "'", teamRepository.findOne(id));
    }
}
