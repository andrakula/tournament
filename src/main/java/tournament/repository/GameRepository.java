package tournament.repository;
import java.math.BigInteger;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.roo.addon.layers.repository.mongo.RooMongoRepository;
import org.springframework.stereotype.Repository;
import tournament.domain.Game;

@Repository
@RooMongoRepository(domainType = Game.class)
public interface GameRepository extends PagingAndSortingRepository<Game, BigInteger> {

    List<Game> findAll();
}
