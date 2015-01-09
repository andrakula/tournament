package tournament.repository;
import java.math.BigInteger;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.roo.addon.layers.repository.mongo.RooMongoRepository;
import org.springframework.stereotype.Repository;
import tournament.domain.Team;

@Repository
@RooMongoRepository(domainType = Team.class)
public interface TeamRepository extends PagingAndSortingRepository<Team, BigInteger> {

    List<Team> findAll();
}
