package tournament.domain;
import java.math.BigInteger;
import java.util.Collection;
import java.util.List;

import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Persistent;

import flexjson.JSONDeserializer;
import flexjson.JSONSerializer;

@Persistent
//@RooJavaBean
//@RooMongoEntity
//@RooJson
public class Team {

    /**
     */
    @NotNull
    private String name;

    /**
     */
    @NotNull
    private Integer points;

    /**
     */
    @NotNull
    private Integer games;

	public String getName() {
        return this.name;
    }

	public void setName(String name) {
        this.name = name;
    }

	public Integer getPoints() {
        return this.points;
    }

	public void setPoints(Integer points) {
        this.points = points;
    }

	public Integer getGames() {
        return this.games;
    }

	public void setGames(Integer games) {
        this.games = games;
    }

	public String toJson() {
        return new JSONSerializer()
        .exclude("*.class").serialize(this);
    }

	public String toJson(String[] fields) {
        return new JSONSerializer()
        .include(fields).exclude("*.class").serialize(this);
    }

	public static Team fromJsonToTeam(String json) {
        return new JSONDeserializer<Team>()
        .use(null, Team.class).deserialize(json);
    }

	public static String toJsonArray(Collection<Team> collection) {
        return new JSONSerializer()
        .exclude("*.class").serialize(collection);
    }

	public static String toJsonArray(Collection<Team> collection, String[] fields) {
        return new JSONSerializer()
        .include(fields).exclude("*.class").serialize(collection);
    }

	public static Collection<Team> fromJsonArrayToTeams(String json) {
        return new JSONDeserializer<List<Team>>()
        .use("values", Team.class).deserialize(json);
    }

	@Id
    private BigInteger id;

	public BigInteger getId() {
        return this.id;
    }

	public void setId(BigInteger id) {
        this.id = id;
    }
}
