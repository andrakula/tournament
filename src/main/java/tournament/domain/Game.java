package tournament.domain;
import java.math.BigInteger;
import java.util.Collection;
import java.util.Date;
import java.util.List;

import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Persistent;
import org.springframework.format.annotation.DateTimeFormat;

import flexjson.JSONDeserializer;
import flexjson.JSONSerializer;

@Persistent
//@RooJavaBean
//@RooMongoEntity
//@RooJson
public class Game {

    /**
     */
    @NotNull
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(style = "M-")
    private Date played;

    /**
     */
    @NotNull
    @ManyToOne
    private Team team1;

    /**
     */
    @NotNull
    @ManyToOne
    private Team team2;

    /**
     */
    @NotNull
    private Integer goals1;

    /**
     */
    @NotNull
    private Integer goals2;

	public Date getPlayed() {
        return this.played;
    }

	public void setPlayed(Date played) {
        this.played = played;
    }

	public Team getTeam1() {
        return this.team1;
    }

	public void setTeam1(Team team1) {
        this.team1 = team1;
    }

	public Team getTeam2() {
        return this.team2;
    }

	public void setTeam2(Team team2) {
        this.team2 = team2;
    }

	public Integer getGoals1() {
        return this.goals1;
    }

	public void setGoals1(Integer goals1) {
        this.goals1 = goals1;
    }

	public Integer getGoals2() {
        return this.goals2;
    }

	public void setGoals2(Integer goals2) {
        this.goals2 = goals2;
    }

	public String toJson() {
        return new JSONSerializer()
        .exclude("*.class").serialize(this);
    }

	public String toJson(String[] fields) {
        return new JSONSerializer()
        .include(fields).exclude("*.class").serialize(this);
    }

	public static Game fromJsonToGame(String json) {
        return new JSONDeserializer<Game>()
        .use(null, Game.class).deserialize(json);
    }

	public static String toJsonArray(Collection<Game> collection) {
        return new JSONSerializer()
        .exclude("*.class").serialize(collection);
    }

	public static String toJsonArray(Collection<Game> collection, String[] fields) {
        return new JSONSerializer()
        .include(fields).exclude("*.class").serialize(collection);
    }

	public static Collection<Game> fromJsonArrayToGames(String json) {
        return new JSONDeserializer<List<Game>>()
        .use("values", Game.class).deserialize(json);
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
