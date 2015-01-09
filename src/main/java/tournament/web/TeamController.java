package tournament.web;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.roo.addon.web.mvc.controller.json.RooWebJson;
import org.springframework.roo.addon.web.mvc.controller.scaffold.RooWebScaffold;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;
import org.springframework.web.util.WebUtils;

import tournament.domain.Team;
import tournament.repository.TeamRepository;

@RequestMapping("/teams")
@Controller
@RooWebScaffold(path = "teams", formBackingObject = Team.class)
@RooWebJson(jsonObject = Team.class)
public class TeamController {

	@RequestMapping(value = "/{id}", method = RequestMethod.GET, headers = "Accept=application/json")
	@ResponseBody
	public ResponseEntity<String> showJson(@PathVariable("id") BigInteger id) {
		Team team = teamRepository.findOne(id);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		if (team == null) {
			return new ResponseEntity<String>(headers, HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<String>(team.toJson(), headers, HttpStatus.OK);
	}

	@RequestMapping(headers = "Accept=application/json")
	@ResponseBody
	public ResponseEntity<String> listJson() {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json; charset=utf-8");
		List<Team> result = teamRepository.findAll();
		return new ResponseEntity<String>(Team.toJsonArray(result), headers,
				HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<String> createFromJson(@RequestBody String json,
			UriComponentsBuilder uriBuilder) {
		Team team = Team.fromJsonToTeam(json);
		teamRepository.save(team);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		RequestMapping a = (RequestMapping) getClass().getAnnotation(
				RequestMapping.class);
		headers.add("Location",
				uriBuilder.path(a.value()[0] + "/" + team.getId().toString())
						.build().toUriString());
		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/jsonArray", method = RequestMethod.POST, headers = "Accept=application/json")
	public ResponseEntity<String> createFromJsonArray(@RequestBody String json) {
		for (Team team : Team.fromJsonArrayToTeams(json)) {
			teamRepository.save(team);
		}
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		return new ResponseEntity<String>(headers, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, headers = "Accept=application/json")
	public ResponseEntity<String> updateFromJson(@RequestBody String json,
			@PathVariable("id") BigInteger id) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		Team team = Team.fromJsonToTeam(json);
		team.setId(id);
		if (teamRepository.save(team) == null) {
			return new ResponseEntity<String>(headers, HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<String>(headers, HttpStatus.OK);
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, headers = "Accept=application/json")
	public ResponseEntity<String> deleteFromJson(
			@PathVariable("id") BigInteger id) {
		Team team = teamRepository.findOne(id);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		if (team == null) {
			return new ResponseEntity<String>(headers, HttpStatus.NOT_FOUND);
		}
		teamRepository.delete(team);
		return new ResponseEntity<String>(headers, HttpStatus.OK);
	}

	@Autowired
	TeamRepository teamRepository;

	@RequestMapping(method = RequestMethod.POST, produces = "text/html")
	public String create(@Valid Team team, BindingResult bindingResult,
			Model uiModel, HttpServletRequest httpServletRequest) {
		if (bindingResult.hasErrors()) {
			populateEditForm(uiModel, team);
			return "teams/create";
		}
		uiModel.asMap().clear();
		teamRepository.save(team);
		return "redirect:/teams/"
				+ encodeUrlPathSegment(team.getId().toString(),
						httpServletRequest);
	}

	@RequestMapping(params = "form", produces = "text/html")
	public String createForm(Model uiModel) {
		populateEditForm(uiModel, new Team());
		return "teams/create";
	}

	@RequestMapping(value = "/{id}", produces = "text/html")
	public String show(@PathVariable("id") BigInteger id, Model uiModel) {
		uiModel.addAttribute("team", teamRepository.findOne(id));
		uiModel.addAttribute("itemId", id);
		return "teams/show";
	}

	@RequestMapping(produces = "text/html")
	public String list(
			@RequestParam(value = "page", required = false) Integer page,
			@RequestParam(value = "size", required = false) Integer size,
			@RequestParam(value = "sortFieldName", required = false) String sortFieldName,
			@RequestParam(value = "sortOrder", required = false) String sortOrder,
			Model uiModel) {
		if (page != null || size != null) {
			int sizeNo = size == null ? 10 : size.intValue();
			final int firstResult = page == null ? 0 : (page.intValue() - 1)
					* sizeNo;
			uiModel.addAttribute(
					"teams",
					teamRepository.findAll(
							new org.springframework.data.domain.PageRequest(
									firstResult / sizeNo, sizeNo)).getContent());
			float nrOfPages = (float) teamRepository.count() / sizeNo;
			uiModel.addAttribute(
					"maxPages",
					(int) ((nrOfPages > (int) nrOfPages || nrOfPages == 0.0) ? nrOfPages + 1
							: nrOfPages));
		} else {

//			uiModel.addAttribute("teams", teamRepository.findAll());

			uiModel.addAttribute("teams",teamRepository.findAll(new Sort(new Sort.Order(Sort.Direction.DESC,
					"points"))));

		}
		return "teams/list";
	}

	@RequestMapping(method = RequestMethod.PUT, produces = "text/html")
	public String update(@Valid Team team, BindingResult bindingResult,
			Model uiModel, HttpServletRequest httpServletRequest) {
		if (bindingResult.hasErrors()) {
			populateEditForm(uiModel, team);
			return "teams/update";
		}
		uiModel.asMap().clear();
		teamRepository.save(team);
		return "redirect:/teams/"
				+ encodeUrlPathSegment(team.getId().toString(),
						httpServletRequest);
	}

	@RequestMapping(value = "/{id}", params = "form", produces = "text/html")
	public String updateForm(@PathVariable("id") BigInteger id, Model uiModel) {
		populateEditForm(uiModel, teamRepository.findOne(id));
		return "teams/update";
	}

	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = "text/html")
	public String delete(@PathVariable("id") BigInteger id,
			@RequestParam(value = "page", required = false) Integer page,
			@RequestParam(value = "size", required = false) Integer size,
			Model uiModel) {
		Team team = teamRepository.findOne(id);
		teamRepository.delete(team);
		uiModel.asMap().clear();
		uiModel.addAttribute("page", (page == null) ? "1" : page.toString());
		uiModel.addAttribute("size", (size == null) ? "10" : size.toString());
		return "redirect:/teams";
	}

	void populateEditForm(Model uiModel, Team team) {
		uiModel.addAttribute("team", team);
	}

	String encodeUrlPathSegment(String pathSegment,
			HttpServletRequest httpServletRequest) {
		String enc = httpServletRequest.getCharacterEncoding();
		if (enc == null) {
			enc = WebUtils.DEFAULT_CHARACTER_ENCODING;
		}
		try {
			pathSegment = UriUtils.encodePathSegment(pathSegment, enc);
		} catch (UnsupportedEncodingException uee) {
		}
		return pathSegment;
	}
	
	
//	@ResponseBody
//	@RequestMapping(value = "/grid", method = RequestMethod.POST, headers = "Accept=application/json")
//    public List<TeamVO> getJQGridList() {
//		 List<Team> result = teamRepository.findAll(); 
//		 List<TeamVO> resultVO = new ArrayList<TeamVO>();
//		 for (Team team : result){
//			 TeamVO teamVO = new TeamVO();
//			 BeanUtils.copyProperties(team, teamVO);
//			 resultVO.add(teamVO);
//		 }
//		 return resultVO;
//    }
	
	@ResponseBody
	@RequestMapping(value = "/grid", method = RequestMethod.POST, headers = "Accept=application/json")
    public List<Team> getJQGridList() {
		 List<Team> result = teamRepository.findAll(); 		 
		 return result;
    }
}
