package tournament.web;

import java.math.BigInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.format.support.FormattingConversionServiceFactoryBean;
import org.springframework.roo.addon.web.mvc.controller.converter.RooConversionService;

import tournament.domain.Game;
import tournament.domain.Team;
import tournament.repository.GameRepository;
import tournament.repository.TeamRepository;

@Configurable
/**
 * A central place to register application converters and formatters. 
 */
public class ApplicationConversionServiceFactoryBean extends FormattingConversionServiceFactoryBean {

	@Override
	protected void installFormatters(FormatterRegistry registry) {
		super.installFormatters(registry);
		// Register application converters and formatters
	}

	@Autowired
	GameRepository gameRepository;

	@Autowired
	TeamRepository teamRepository;

	public Converter<Game, String> getGameToStringConverter() {
		return new org.springframework.core.convert.converter.Converter<tournament.domain.Game, java.lang.String>() {
			public String convert(Game game) {
				return new StringBuilder().append(game.getPlayed()).append(' ')
						.append(game.getGoals1()).append(' ')
						.append(game.getGoals2()).toString();
			}
		};
	}

	public Converter<BigInteger, Game> getIdToGameConverter() {
		return new org.springframework.core.convert.converter.Converter<java.math.BigInteger, tournament.domain.Game>() {
			public tournament.domain.Game convert(java.math.BigInteger id) {
				return gameRepository.findOne(id);
			}
		};
	}

	public Converter<String, Game> getStringToGameConverter() {
		return new org.springframework.core.convert.converter.Converter<java.lang.String, tournament.domain.Game>() {
			public tournament.domain.Game convert(String id) {
				return getObject().convert(
						getObject().convert(id, BigInteger.class), Game.class);
			}
		};
	}

	public Converter<Team, String> getTeamToStringConverter() {
		return new org.springframework.core.convert.converter.Converter<tournament.domain.Team, java.lang.String>() {
			public String convert(Team team) {
				return new StringBuilder().append(team.getName()).toString();
			}
		};
	}

	public Converter<BigInteger, Team> getIdToTeamConverter() {
		return new org.springframework.core.convert.converter.Converter<java.math.BigInteger, tournament.domain.Team>() {
			public tournament.domain.Team convert(java.math.BigInteger id) {
				return teamRepository.findOne(id);
			}
		};
	}

	public Converter<String, Team> getStringToTeamConverter() {
		return new org.springframework.core.convert.converter.Converter<java.lang.String, tournament.domain.Team>() {
			public tournament.domain.Team convert(String id) {
				return getObject().convert(
						getObject().convert(id, BigInteger.class), Team.class);
			}
		};
	}

	public void installLabelConverters(FormatterRegistry registry) {
		registry.addConverter(getGameToStringConverter());
		registry.addConverter(getIdToGameConverter());
		registry.addConverter(getStringToGameConverter());
		registry.addConverter(getTeamToStringConverter());
		registry.addConverter(getIdToTeamConverter());
		registry.addConverter(getStringToTeamConverter());
	}

	public void afterPropertiesSet() {
		super.afterPropertiesSet();
		installLabelConverters(getObject());
	}
}
