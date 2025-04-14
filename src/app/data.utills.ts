export interface ILocationItem {
    id: string;
    title: string;
    linkForecastCurrent: string;
    linkWeatherOnSite: string;
    places?: IPlaceItem[];
}

export interface IPlaceItem {
    id: string;
    title: string;
    linkWeatherOnSite: string;
}




export function initLocations() {
    const dwdBaseUrl = `https://www.dwd.de`;
    const places: IPlaceItem[] = [];
    const locations: ILocationItem[] = [
        {
            id: 'deutschland',
            title: 'Deutschland',
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/vhs_brd_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/_node.html`
        },
        {
            id: 'baden-wuerttemberg',
            title: 'Ba­den-Würt­tem­berg',
            places: [
                { id: 'feldberg', title: 'Feld­berg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/feldberg/_node.html` },
                { id: 'freudenstadt', title: 'Freu­den­stadt', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/freudenstadt/_node.html` },
                { id: 'konstanz', title: 'Kon­stanz', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/konstanz/_node.html` },
                { id: 'lahr', title: 'Lahr', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/lahr/_node.html` },
                { id: 'mann­heim', title: 'Mann­heim', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/mannheim/_node.html` },
                { id: 'oehringen', title: 'Öhrin­gen', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/oehringen/_node.html` },
                { id: 'rheinstetten', title: 'Rheins­tet­ten', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/rheinstetten/_node.html` },
                { id: 'stoetten', title: 'Stöt­ten', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/stoetten/_node.html` },
                { id: 'stuttgart', title: 'Stutt­gart (Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/stuttgart/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/baden-wuerttemberg/vhs_bawue_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/baden-wuerttemberg/bawue_node.html`
        },
        {
            id: 'bayern',
            title: 'Bay­ern',
            places: [
                { id: 'augsburg', title: 'Augs­burg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/augsburg/_node.html` },
                { id: 'bamberg', title: 'Bam­berg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/bamberg/_node.html` },
                { id: 'fuerstenzell', title: 'Fürs­ten­zell', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/fuerstenzell/_node.html` },
                { id: 'grosser_arber', title: 'Großer Ar­ber', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/grosser_arber/_node.html` },
                { id: 'hof', title: 'Hof', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/hof/_node.html` },
                { id: 'hohenpeissenberg', title: 'Ho­hen­pei­ßen­berg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/hohenpeissenberg/_node.html` },
                { id: 'kempten', title: 'Kemp­ten', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/kempten/_node.html` },
                { id: 'muenchen', title: 'Mün­chen (Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/muenchen/_node.html` },
                { id: 'nuernberg', title: 'Nürn­berg (Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/nuernberg/_node.html` },
                { id: 'oberstdorf', title: 'Oberst­dorf', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/oberstdorf/_node.html` },
                { id: 'regensburg', title: 'Re­gens­burg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/regensburg/_node.html` },
                { id: 'straubing', title: 'Strau­bing', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/straubing/_node.html` },
                { id: 'weiden', title: 'Wei­den', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/weiden/_node.html` },
                { id: 'wuerzburg', title: 'Würz­burg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/wuerzburg/_node.html` },
                { id: 'zugspitze', title: 'Zug­spit­ze', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/zugspitze/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/bayern/vhs_bay_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/bayern/bayern_node.html`
        },
        {
            id: 'berlin-brandenburg',
            title: 'Ber­lin und Bran­den­burg',
            places: [
                { id: 'angermuende', title: 'An­ger­mün­de', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/angermuende/_node.html` },
                { id: 'berlin_dahlem', title: 'Ber­lin Dah­lem', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/berlin_dahlem/_node.html` },
                { id: 'berlin_tegel', title: 'Ber­lin Te­gel', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/berlin_tegel/_node.html` },
                { id: 'berlin_tempelhof', title: 'Ber­lin Tem­pel­hof', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/berlin_tempelhof/_node.html` },
                { id: 'cottbus', title: 'Cott­bus', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/cottbus/_node.html` },
                { id: 'lindenberg', title: 'Lin­den­berg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/lindenberg/_node.html` },
                { id: 'neuruppin', title: 'Neu­rup­pin', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/neuruppin/_node.html` },
                { id: 'potsdam', title: 'Pots­dam', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/potsdam/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/berlin_brandenburg/vhs_bbb_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/berlin-brandenburg/bbb_node.html`
        },
        {
            id: 'hessen',
            title: 'Hes­sen',
            places: [
                { id: 'frankfurt', title: 'Frank­furt(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/frankfurt/_node.html` },
                { id: 'fritzlar', title: 'Fritz­lar', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/fritzlar/_node.html` },
                { id: 'giessen', title: 'Gie­ßen', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/giessen/_node.html` },
                { id: 'offenbach', title: 'Of­fen­bach', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/offenbach/_node.html` },
                { id: 'wasserkuppe', title: 'Was­ser­kup­pe', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/wasserkuppe/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/hessen/vhs_hes_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/hessen/hessen_node.html`
        },
        {
            id: 'mecklenburg-vorpommern',
            title: 'Meck­len­burg-Vor­pom­mern',
            places: [
                { id: 'arkona', title: 'Ar­ko­na', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/arkona/_node.html` },
                { id: 'greifswald', title: 'Greifs­wald', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/greifswald/_node.html` },
                { id: 'marnitz', title: 'Mar­nitz', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/marnitz/_node.html` },
                { id: 'schwerin', title: 'Schwe­rin', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/schwerin/_node.html` },
                { id: 'waren', title: 'Wa­ren', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/waren/_node.html` },
                { id: 'warnemuende', title: 'War­ne­mün­de', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/warnemuende/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/mecklenburg_vorpommern/vhs_mvp_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/mecklenburg-vorpommern/mvp_node.html`
        },
        {
            id: 'niedersachsen_bremen',
            title: 'Nie­der­sach­sen und Bre­men',
            places: [
                { id: 'bremen', title: 'Bre­men(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/bremen/_node.html` },
                { id: 'cuxhaven', title: 'Cux­ha­ven', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/cuxhaven/_node.html` },
                { id: 'emden', title: 'Em­den(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/emden/_node.html` },
                { id: 'hannover', title: 'Han­no­ver(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/hannover/_node.html` },
                { id: 'luechow', title: 'Lüchow', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/luechow/_node.html` },
                { id: 'norderney', title: 'Nor­der­ney', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/norderney/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/niedersachsen_bremen/vhs_nib_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/niedersachsen_bremen/nib_node.html`
        },
        {
            id: 'nordrhein-westfalen',
            title: 'Nord­rhein-West­fa­len',
            places: [
                { id: 'aachen', title: 'Aa­chen - Ors­bach', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/aachen/_node.html` },
                { id: 'bad_lippspringe', title: 'Bad Lipp­sprin­ge', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/bad_lippspringe/_node.html` },
                { id: 'duesseldorf', title: 'Düs­sel­dorf(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/duesseldorf/_node.html` },
                { id: 'essen', title: 'Es­sen', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/essen/_node.html` },
                { id: 'kahler_asten', title: 'Kah­ler As­ten', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/kahler_asten/_node.html` },
                { id: 'koeln_bonn', title: 'Köln / Bonn(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/koeln_bonn/_node.html` },
                { id: 'muenster', title: 'Müns­ter / Os­na­brück(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/muenster/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/nordrhein_westfalen/vhs_nrw_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/nordrhein-westfalen/nrw_node.html`
        },
        {
            id: 'rheinland-pfalz-saarland',
            title: 'Rhein­land-Pfalz und Saar­land',
            places: [
                { id: 'hahn', title: 'Hahn', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/rheinland-pfalz-saarland/hahn/_node.html` },
                { id: 'nuerburg_barweiler', title: 'Nür­burg - Bar­wei­ler', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/rheinland-pfalz-saarland/nuerburg_barweiler/_node.html` },
                { id: 'saarbruecken', title: 'Saar­brücken(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/rheinland-pfalz-saarland/saarbruecken/_node.html` },
                { id: 'trier', title: 'Trier', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/rheinland-pfalz-saarland/trier/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/rheinland-pfalz_saarland/vhs_rps_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/rheinland-pfalz-saarland/rps_node.html`
        },
        {
            id: 'sachsen',
            title: 'Sach­sen',
            places: [
                { id: 'dresden', title: 'Dres­den(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen/dresden/_node.html` },
                { id: 'fichtelberg', title: 'Fich­tel­berg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen/fichtelberg/_node.html` },
                { id: 'goerlitz', title: 'Gör­litz', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen/goerlitz/_node.html` },
                { id: 'leipzig', title: 'Leip­zig(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen/leipzig/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/sachsen/vhs_sac_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen/sac_node.html`
        },
        {
            id: 'sachsen-anhalt',
            title: 'Sach­sen-An­halt',
            places: [
                { id: 'brocken', title: 'Bro­cken', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen-anhalt/brocken/_node.html` },
                { id: 'magdeburg', title: 'Mag­de­burg', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen-anhalt/magdeburg/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/sachen_anhalt/vhs_saa_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/sachsen-anhalt/saa_node.html`
        },

        {
            id: 'schleswig-holstein_hamburg',
            title: 'Schles­wig-Hol­stein und Ham­burg',
            places: [
                { id: 'fehmann', title: 'Feh­marn', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/fehmann/_node.html` },
                { id: 'hamburg', title: 'Ham­burg(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/hamburg/_node.html` },
                { id: 'helgoland', title: 'Hel­go­land', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/helgoland/_node.html` },
                { id: 'kiel', title: 'Kiel', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/kiel/_node.html` },
                { id: 'list_sylt', title: 'List auf Sylt', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/list_sylt/_node.html` },
                { id: 'schleswig', title: 'Schles­wig', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/schleswig/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/schleswig_holstein_hamburg/vhs_shh_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/schleswig-holstein_hamburg/shh_node.html`
        },
        {
            id: 'thueringen',
            title: 'Thü­rin­gen',
            places: [
                { id: 'erfurt', title: 'Er­furt(Flugh.)', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/thueringen/erfurt/_node.html` },
                { id: 'gera', title: 'Ge­ra', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/thueringen/gera/_node.html` },
                { id: 'meiningen', title: 'Mei­nin­gen', linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/thueringen/meiningen/_node.html` }
            ],
            linkForecastCurrent: `${dwdBaseUrl}/DE/wetter/vorhersage_aktuell/thueringen/vhs_thu_node.html`,
            linkWeatherOnSite: `${dwdBaseUrl}/DE/wetter/wetterundklima_vorort/thueringen/thu_node.html`
        }
    ];

    locations.map((l) => {
        if (l.places) {
          l.places.map(p => places.push(p));
        }
      });

    return{
        locations,
        places
    }
}