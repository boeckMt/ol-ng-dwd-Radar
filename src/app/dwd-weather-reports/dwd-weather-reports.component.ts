import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

interface ILocationItem {
  id: string;
  title: string;
  linkForecastCurrent: string;
  linkWeatherOnSite: string;
  places?: IPlaceItem[];
}

interface IPlaceItem {
  id: string;
  title: string;
  linkWeatherOnSite: string;
}

@Component({
  selector: 'app-dwd-weather-reports',
  templateUrl: './dwd-weather-reports.component.html',
  styleUrls: ['./dwd-weather-reports.component.scss']
})
export class DwdWeatherReportsComponent implements OnInit {
  @Input() location1: string = 'bayern';
  @Input() location2: string = 'muenchen';
  dwdBaseUrl = `https://www.dwd.de`;
  locations: ILocationItem[] = [
    {
      id: 'deutschland',
      title: 'Deutschland',
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/vhs_brd_node.html`,
      linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/_node.html`
    },
    {
      id: 'baden-wuerttemberg',
      title: 'Ba­den-Würt­tem­berg',
      places: [
        { id: 'feldberg', title: 'Feld­berg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/feldberg/_node.html` },
        { id: 'freudenstadt', title: 'Freu­den­stadt', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/freudenstadt/_node.html` },
        { id: 'konstanz', title: 'Kon­stanz', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/konstanz/_node.html` },
        { id: 'lahr', title: 'Lahr', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/lahr/_node.html` },
        { id: 'mann­heim', title: 'Mann­heim', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/mannheim/_node.html` },
        { id: 'oehringen', title: 'Öhrin­gen', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/oehringen/_node.html` },
        { id: 'rheinstetten', title: 'Rheins­tet­ten', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/rheinstetten/_node.html` },
        { id: 'stoetten', title: 'Stöt­ten', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/stoetten/_node.html` },
        { id: 'stuttgart', title: 'Stutt­gart (Flugh.)', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/stuttgart/_node.html` }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/baden-wuerttemberg/vhs_bawue_node.html`,
      linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/bawue_node.html`
    },
    {
      id: 'bayern',
      title: 'Bay­ern',
      places: [
        { id: 'augsburg', title: 'Augs­burg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/augsburg/_node.html` },
        { id: 'bamberg', title: 'Bam­berg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/bamberg/_node.html` },
        { id: 'fuerstenzell', title: 'Fürs­ten­zell', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/fuerstenzell/_node.html` },
        { id: 'grosser_arber', title: 'Großer Ar­ber', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/grosser_arber/_node.html` },
        { id: 'hof', title: 'Hof', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/hof/_node.html` },
        { id: 'hohenpeissenberg', title: 'Ho­hen­pei­ßen­berg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/hohenpeissenberg/_node.html` },
        { id: 'kempten', title: 'Kemp­ten', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/kempten/_node.html` },
        { id: 'muenchen', title: 'Mün­chen (Flugh.)', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/muenchen/_node.html` },
        { id: 'nuernberg', title: 'Nürn­berg (Flugh.)', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/nuernberg/_node.html` },
        { id: 'oberstdorf', title: 'Oberst­dorf', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/oberstdorf/_node.html` },
        { id: 'regensburg', title: 'Re­gens­burg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/regensburg/_node.html` },
        { id: 'straubing', title: 'Strau­bing', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/straubing/_node.html` },
        { id: 'weiden', title: 'Wei­den', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/weiden/_node.html` },
        { id: 'wuerzburg', title: 'Würz­burg', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/wuerzburg/_node.html` },
        { id: 'zugspitze', title: 'Zug­spit­ze', linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/zugspitze/_node.html` }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/bayern/vhs_bay_node.html`,
      linkWeatherOnSite: `${this.dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/bayern_node.html`
    },
    {
      id: 'berlin-brandenburg',
      title: 'Ber­lin und Bran­den­burg',
      places: [
        { id: '', title: 'An­ger­mün­de', linkWeatherOnSite: '' },
        { id: '', title: 'Ber­lin Dah­lem', linkWeatherOnSite: '' },
        { id: '', title: 'Ber­lin Te­gel', linkWeatherOnSite: '' },
        { id: '', title: 'Ber­lin Tem­pel­hof', linkWeatherOnSite: '' },
        { id: '', title: 'Cott­bus', linkWeatherOnSite: '' },
        { id: '', title: 'Lin­den­berg', linkWeatherOnSite: '' },
        { id: '', title: 'Neu­rup­pin', linkWeatherOnSite: '' },
        { id: '', title: 'Pots­dam', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/berlin_brandenburg/vhs_bbb_node.html`,
      linkWeatherOnSite: 'https://www.dwd.de/DE/wetter/wetterundklima_vorort/berlin-brandenburg/bbb_node.html'
    },
    {
      id: '',
      title: 'Hes­sen',
      places: [
        { id: '', title: 'Frank­furt(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Fritz­lar', linkWeatherOnSite: '' },
        { id: '', title: 'Gie­ßen', linkWeatherOnSite: '' },
        { id: '', title: 'Of­fen­bach', linkWeatherOnSite: '' },
        { id: '', title: 'Was­ser­kup­pe', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/hessen/vhs_hes_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Meck­len­burg-Vor­pom­mern',
      places: [
        { id: '', title: 'Ar­ko­na', linkWeatherOnSite: '' },
        { id: '', title: 'Greifs­wald', linkWeatherOnSite: '' },
        { id: '', title: 'Mar­nitz', linkWeatherOnSite: '' },
        { id: '', title: 'Schwe­rin', linkWeatherOnSite: '' },
        { id: '', title: 'Wa­ren', linkWeatherOnSite: '' },
        { id: '', title: 'War­ne­mün­de', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/mecklenburg_vorpommern/vhs_mvp_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Nie­der­sach­sen und Bre­men',
      places: [
        { id: '', title: 'Bre­men(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Cux­ha­ven', linkWeatherOnSite: '' },
        { id: '', title: 'Em­den(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Han­no­ver(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Lüchow', linkWeatherOnSite: '' },
        { id: '', title: 'Nor­der­ney', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/niedersachsen_bremen/vhs_nib_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Nord­rhein-West­fa­len',
      places: [
        { id: '', title: 'Aa­chen - Ors­bach', linkWeatherOnSite: '' },
        { id: '', title: 'Bad Lipp­sprin­ge', linkWeatherOnSite: '' },
        { id: '', title: 'Düs­sel­dorf(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Es­sen', linkWeatherOnSite: '' },
        { id: '', title: 'Kah­ler As­ten', linkWeatherOnSite: '' },
        { id: '', title: 'Köln / Bonn(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Müns­ter / Os­na­brück(Flugh.)', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/nordrhein_westfalen/vhs_nrw_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Rhein­land-Pfalz und Saar­land',
      places: [
        { id: '', title: 'Hahn', linkWeatherOnSite: '' },
        { id: '', title: 'Nür­burg - Bar­wei­ler', linkWeatherOnSite: '' },
        { id: '', title: 'Saar­brücken(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Trier', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/rheinland-pfalz_saarland/vhs_rps_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Sach­sen-An­halt',
      places: [
        { id: '', title: 'Bro­cken', linkWeatherOnSite: '' },
        { id: '', title: 'Mag­de­burg', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/sachen_anhalt/vhs_saa_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Sach­sen',
      places: [
        { id: '', title: 'Dres­den(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Fich­tel­berg', linkWeatherOnSite: '' },
        { id: '', title: 'Gör­litz', linkWeatherOnSite: '' },
        { id: '', title: 'Leip­zig(Flugh.)', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/sachsen/vhs_sac_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Schles­wig-Hol­stein und Ham­burg',
      places: [
        { id: '', title: 'Feh­marn', linkWeatherOnSite: '' },
        { id: '', title: 'Ham­burg(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Hel­go­land', linkWeatherOnSite: '' },
        { id: '', title: 'Kiel', linkWeatherOnSite: '' },
        { id: '', title: 'List auf Sylt', linkWeatherOnSite: '' },
        { id: '', title: 'Schles­wig', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/schleswig_holstein_hamburg/vhs_shh_node.html`,
      linkWeatherOnSite: ''
    },
    {
      id: '',
      title: 'Thü­rin­gen',
      places: [
        { id: '', title: 'Er­furt(Flugh.)', linkWeatherOnSite: '' },
        { id: '', title: 'Ge­ra', linkWeatherOnSite: '' },
        { id: '', title: 'Mei­nin­gen', linkWeatherOnSite: '' }
      ],
      linkForecastCurrent: `${this.dwdBaseUrl}/DE/wetter/vorhersage_aktuell/thueringen/vhs_thu_node.html`,
      linkWeatherOnSite: ''
    },
  ];

  places: IPlaceItem[] = [];

  constructor() {
    this.locations.map((l) => {
      if (l.places) {
        l.places.map(p => this.places.push(p));
        // this.places.concat(l.places)
      }
    });
    console.log(this.places)

  }

  ngOnInit(): void {
  }

}
