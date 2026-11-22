"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Icon from "../components/Icon";
import { apiRequest, imageUrl } from "../../lib/api";
import { useLanguage } from "../components/LanguageProvider";

const places = [
  {
    name: "Taltalaiya",
    image: "/tourist-places/taltalaiya.png",
    mapQuery: "Taltalaiya Itahari Sunsari Nepal",
    descriptionEn: "Taltalaiya is a scenic wetland park and popular tourist destination located in Itahari Sub-Metropolitan City, Sunsari. Surrounded by lush greenery, this expansive recreational area is famous for its seven interconnected natural ponds that offer peaceful boating experiences. Visitors can also explore a unique open-air stone sculpture garden, observe diverse birds and animals in the mini zoo, and relax in spacious picnic grounds. Blending natural beauty with family-friendly attractions, Taltalaiya serves as a favorite weekend getaway for locals and travelers across eastern Nepal.",
    descriptionNe: "तालतलैया सुनसरीको इटहरी उपमहानगरपालिकामा अवस्थित एक रमणीय सिमसार क्षेत्र तथा लोकप्रिय पर्यटकीय गन्तव्य हो। हरियाली जङ्गलले घेरिएको यो विशाल मनोरञ्जन स्थल सातवटा आपसमा जोडिएका प्राकृतिक पोखरीहरूका लागि प्रसिद्ध छ, जहाँ शान्त वातावरणमा डुङ्गा सयरको आनन्द लिन सकिन्छ। यहाँ आउने पर्यटकहरूले खुला आकाशमुनि रहेका कलात्मक ढुङ्गाका मूर्तिहरूको बगैँचा अवलोकन गर्न, मिनी चिडियाखानामा विभिन्न चराचुरुङ्गी तथा जनावरहरू हेर्न र फराकिलो पिकनिक स्थलमा रमाउन सक्छन्। प्राकृतिक सौन्दर्य र पारिवारिक मनोरञ्जनको सङ्गम रहेको तालतलैया पूर्वी नेपालका आन्तरिक तथा बाह्य पर्यटकहरूका लागि एक उत्कृष्ट घुमफिर स्थल बनेको छ।",
  },
  {
    name: "Yippee Land Amusement & Water Park",
    image: "/tourist-places/yippee-land.png",
    mapQuery: "Yippee Land Amusement and Water Park Itahari Nepal",
    descriptionEn: "Yippee Land Amusement & Water Park is a premier family entertainment destination located near Taltalaiya in Itahari-2, Koshi Province. Designed to offer a full day of fun for visitors of all ages, the park seamlessly blends thrilling water attractions—such as high-speed body and tube slides, a lively wave pool, rain dance zones, and dedicated kids' pools—with exciting dry rides, a zipline, and a life-sized Dinosaur Island theme park. Alongside its wide variety of activities, the venue provides convenient on-site dining, changing facilities, and occasional live weekend entertainment, making it a popular spot for family outings, school trips, and weekend getaways.",
    descriptionNe: "यिप्पी ल्यान्ड एम्युजमेन्ट एण्ड वाटर पार्क कोशी प्रदेशको इटहरी-२, तालतलैया नजिकै अवस्थित एक प्रमुख पारिवारिक मनोरञ्जन स्थल हो। सबै उमेर समूहका आगन्तुकहरूलाई दिनभरि रमाइलो प्रदान गर्ने उद्देश्यले बनाइएको यस पार्कमा वाटर स्लाइड, वेभ पुल, रेन डान्स र बालबालिकाका लागि छुट्टै स्विमिङ पुल जस्ता पानीका खेलहरूका साथै विभिन्न रमाइला राइडहरू, जिपलाइन र डाइनोसर थिम पार्क (जुरासिक पार्क) को समेत मज्जा लिन सकिन्छ। विविध खेलकुद र मनोरञ्जनका साथै यहाँ खाजा-खानाका लागि रेस्टुरेन्ट, चेन्जिङ रुम र सप्ताहान्तमा विशेष सांगीतिक कार्यक्रमहरूको समेत व्यवस्था रहेकाले यो स्थान पारिवारिक भ्रमण, शैक्षिक अवलोकन र बिदा मनाउनका लागि अत्यन्तै लोकप्रिय गन्तव्य बनेको छ।",
  },
  {
    name: "Gokulam Resort",
    image: "/tourist-places/gokulam-resort.png",
    mapQuery: "Gokulam Resort Sundarharaicha Nepal",
    descriptionEn: "Gokulam Resort is a popular family-friendly park, picnic spot, and getaway located in Sundar Dulari (Sundarharaicha), just east of Itahari along the East-West Highway. Set across spacious landscaped gardens, the resort offers a wide range of recreational activities including paddle boating, a swimming pool, a mini tourist train, rope cycling, and camel and horse rides. Visitors also enjoy taking photos beside miniature replicas of famous landmarks like the Eiffel Tower and the Taj Mahal, as well as relaxing at the on-site restaurant and equipped picnic huts. Whether for a lively weekend day trip with children or a quiet overnight stay, Gokulam Resort serves as one of eastern Nepal's favorite leisure destinations.",
    descriptionNe: "गोकुलम रिसोर्ट (Gokulam Resort) इटहरीको ठीक पूर्वतर्फ पूर्व–पश्चिम राजमार्गको छेउमा रहेको सुन्दरदुलारी (सुन्दरहरैंचा) मा अवस्थित एक लोकप्रिय पारिवारिक पार्क, पिकनिक स्थल तथा विश्राम गन्तव्य हो। फराकिलो र सुन्दर बगैँचामा फैलिएको यस रिसोर्टमा प्याडल बोटिङ, स्विमिङ पुल, मिनी पर्यटक रेल, रोप साइक्लिङका साथै ऊँट र घोडा सवारी जस्ता विभिन्न मनोरञ्जनात्मक गतिविधिहरूको आनन्द लिन सकिन्छ। यहाँ आउने आगन्तुकहरूले आइफल टावर र ताजमहल जस्ता विश्वप्रसिद्ध सम्पदाका साना प्रतिरूपहरूसँग तस्बिर खिच्न, सुसज्जित पिकनिक स्पटमा रमाउन र रिसोर्टकै रेस्टुरेन्टमा स्वादिष्ट परिकारको स्वाद लिन सक्छन्। बालबालिकासहितको एकदिने पारिवारिक भ्रमण होस् वा रात बिताउने शान्त बसाइ, गोकुलम रिसोर्ट पूर्वी नेपालको एक प्रमुख आकर्षणको केन्द्र बनेको छ।",
  },
  {
    name: "Gokarna Resort & Fun Park",
    image: "/tourist-places/gokarna-resort.png",
    mapQuery: "Gokarna Resort and Fun Park Sundarharaicha Nepal",
    descriptionEn: "Gokarna Resort & Fun Park is a lively recreational destination located in Sundar Dulari (Sundarharaicha Municipality), just east of Itahari in Koshi Province. Designed for families, friends, and event gatherings, the park features a swimming pool, a water park area, fun rides, a dedicated children's playground, and landscaped gardens. Guests can also enjoy live performances, dine at the on-site restaurant and bar, or book rental halls and lodge rooms for celebrations and overnight stays. With its accessible facilities and wide variety of entertainment, it serves as a convenient getaway for relaxation and family fun near Itahari.",
    descriptionNe: "गोकर्ण रिसोर्ट एण्ड फन पार्क (Gokarna Resort & Fun Park) कोशी प्रदेशको इटहरी नजिकै सुन्दरदुलारी (सुन्दरहरैंचा नगरपालिका) मा अवस्थित एक रमाइलो मनोरञ्जन गन्तव्य हो। परिवार, साथीभाइ र विभिन्न कार्यक्रमहरूको आयोजनाका लागि उपयुक्त यस पार्कमा स्विमिङ पुल, वाटर पार्क, रमाइला राइडहरू, बालबालिकाका लागि खेल मैदान र सुन्दर बगैँचाको व्यवस्था छ। आगन्तुकहरूले यहाँ प्रत्यक्ष सांगीतिक प्रस्तुति (लाइभ पर्फमेन्स) को आनन्द लिन, रेस्टुरेन्ट तथा बारमा स्वादिष्ट परिकार चाख्न र विशेष समारोह वा बास बस्नका लागि हल तथा लज कोठाहरू बुक गर्न सक्छन्। सहज पहुँच र विविध मनोरञ्जन सुविधाका कारण यो स्थान इटहरी आसपासको एक आकर्षक भ्रमण स्थल बनेको छ।",
  },
  {
    name: "Shree Krishna Pranami Mandir (Muktidham)",
    image: "/tourist-places/muktidham.png",
    mapQuery: "Shree Krishna Pranami Mandir Muktidham Itahari Nepal",
    descriptionEn: "Shree Krishna Pranami Mandir (also known as Muktidham) is a revered pilgrimage site and spiritual landmark on the western bank of the Budhiganga-Jamuna River, along the border of Itahari Sub-Metropolitan City and Sundarharaicha Municipality in Koshi Province. Originally established in 1978 by Guruji Shree 108 Mangaldas Ji Maharaj and grandly reconstructed in 2018, the temple features stunning white-and-gold Rajasthani-Mughal architecture adorned with intricate carvings, domes, and stone panels depicting the life of Lord Krishna. Beyond serving as a peaceful hub for daily prayers, bhajans, and grand Krishna Janmashtami celebrations, the temple complex operates as a dedicated center for social service, offering shelter, care, and support for the elderly and orphaned children.",
    descriptionNe: "श्री कृष्ण प्रणामी मन्दिर (मुक्तिधाम) कोशी प्रदेशको इटहरी उपमहानगरपालिका र सुन्दरहरैंचा नगरपालिकाको सिमानामा पर्ने बुढीगङ्गा–जमुना नदीको पश्चिमी किनारमा अवस्थित एक प्रसिद्ध धार्मिक तथा पर्यटकीय तीर्थस्थल हो। वि.सं. २०३५ (सन् १९७८) मा गुरुजी श्री १०८ मङ्गलदास जी महाराजद्वारा स्थापित र वि.सं. २०७५ (सन् २०१८) मा भव्य रूपले पुनर्निर्माण गरिएको यस मन्दिरको सेतो र सुनौलो रङको कलात्मक वास्तुकला, आकर्षक गुम्बज तथा भगवान् श्रीकृष्णको लीला झल्काउने बुट्टाहरूले जोकोहीलाई मन्त्रमुग्ध पार्छ। दैनिक पूजापाठ, भजनकीर्तन र श्रीकृष्ण जन्माष्टमीको विशेष मेलाका साथै यस मन्दिर परिसरले वृद्धवृद्धा तथा असहाय बालबालिकाको पालनपोषण, आश्रय र सेवा गर्ने एक उत्कृष्ट सामाजिक केन्द्रको रूपमा समेत महत्वपूर्ण योगदान पुर्‍याउँदै आएको छ।",
  },
  {
    name: "Budhi River Ghat",
    image: "/tourist-places/budhi-river-ghat.png",
    mapQuery: "Budhi Ganga Mukti Ghat Itahari Nepal",
    descriptionEn: "Budhi River Ghat (commonly known as Budhi Ganga Mukti Ghat or Budhi Khola Ghat) is a prominent riverside religious, cultural, and community landmark along the Budhi Khola river, which forms the natural border between Sunsari and Morang districts in Itahari. Located right beside the renowned Shree Krishna Pranami Mandir, the ghat is best known for its grand, illuminated celebrations during the Chhath festival, when thousands of devotees gather along the decorated riverbanks to offer prayers to the rising and setting sun. In addition to hosting sacred Hindu rituals, holy baths, and traditional cremations at its well-managed Mukti Ghat section, the surrounding riverbanks and nearby check-dam areas have also become popular local spots for evening walks, river views, and seasonal recreation.",
    descriptionNe: "बुढी नदी घाट (जसलाई बुढीगङ्गा मुक्ति घाट वा बुढी खोला घाट भनेर पनि चिनिन्छ) सुनसरी र मोरङ जिल्लाको सिमाना छुट्याउँदै बग्ने इटहरीको बुढी खोला किनारमा अवस्थित एक महत्वपूर्ण धार्मिक, सांस्कृतिक तथा सामुदायिक स्थल हो। प्रसिद्ध श्री कृष्ण प्रणामी मन्दिरको ठीक छेउमा रहेको यो घाट विशेष गरी छठ पर्वको समयमा निकै आकर्षक बन्ने गर्दछ, जहाँ हजारौँ व्रतालु तथा श्रद्धालु भक्तजनहरू झिलिमिली बत्तीले सजाइएको नदी किनारमा भेला भई अस्ताउँदो र उदाउँदो सूर्यलाई अर्घ्य दिएर पूजाआराधना गर्दछन्। व्यवस्थित मुक्ति घाटको रूपमा अन्तिम संस्कार, धार्मिक स्नान र विभिन्न सांस्कृतिक अनुष्ठानहरू सम्पन्न गरिने यस क्षेत्रको नदी किनार र आसपासको बाँध क्षेत्र आजभोलि स्थानीय बासिन्दा तथा आगन्तुकहरूका लागि शान्त भ्रमण र रमाइलो घुमफिरको गन्तव्यसमेत बनेको छ।",
  },
  {
    name: "Bhatbhateni Supermarket",
    image: "/tourist-places/bhatbhateni.png",
    mapQuery: "Bhatbhateni Supermarket Itahari Sunsari Nepal",
    descriptionEn: "Bhatbhateni Supermarket Itahari is a premier retail complex and department store located in Labipur (Itahari-16), just west of Itahari Chowk along the East-West Highway. As one of the largest branches of Nepal's leading supermarket chain, it serves as a convenient one-stop shopping destination for residents and visitors across Koshi Province. Spread across multiple floors, the store offers an extensive selection of fresh groceries, household supplies, clothing, footwear, cosmetics, electronics, and home appliances under one roof. In addition to its modern, wheelchair-accessible facilities and ample parking, the complex features a dedicated children's play area and arcade games, making it a popular spot for both daily shopping and family outings.",
    descriptionNe: "भाटभटेनी सुपरमार्केट इटहरी पूर्व–पश्चिम राजमार्ग अन्तर्गत इटहरी चोकको ठीक पश्चिमतर्फ लबिपुर (इटहरी–१६) मा अवस्थित एक प्रमुख व्यापारिक कम्प्लेक्स तथा डिपार्टमेन्ट स्टोर हो। नेपालको अग्रणी सुपरमार्केट शृङ्खलाको एक विशाल शाखाको रूपमा रहेको यस स्टोरले कोशी प्रदेशका स्थानीय बासिन्दा तथा आगन्तुकहरूका लागि एउटै छानामुनि सम्पूर्ण किनमेलको सुविधा प्रदान गर्दछ। धेरै तल्लामा फैलिएको यस सुपरमार्केटमा ताजा खाद्यान्न, घरायसी सामान, लत्ताकपडा, जुत्ताचप्पल, कस्मेटिक्स, इलेक्ट्रोनिक्स र घरायसी उपकरणहरूको विस्तृत भण्डार उपलब्ध छ। आधुनिक तथा अपाङ्गमैत्री संरचना, पर्याप्त पार्किङ सुविधा र बालबालिकाका लागि खेल क्षेत्र तथा आर्केड गेमहरूको समेत व्यवस्था भएकाले यो स्थान दैनिक किनमेलका साथै पारिवारिक घुमफिरको समेत आकर्षक केन्द्र बनेको छ।",
  },
];

export default function TouristPlacesPage() {
  const { language, t } = useLanguage();
  const [managedPlaces, setManagedPlaces] = useState([]);
  const [placesError, setPlacesError] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/tourist-places")
      .then((response) => {
        if (active) setManagedPlaces(response.data || []);
      })
      .catch((error) => {
        if (active) setPlacesError(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const visiblePlaces = [
    ...places.map((place) => ({
      ...place,
      key: place.name,
      displayName: place.name,
      displayDescription: language === "en" ? place.descriptionEn : place.descriptionNe,
      displayImage: place.image,
      mapQuery: place.mapQuery,
    })),
    ...managedPlaces.map((place) => ({
      ...place,
      key: place._id,
      displayName: language === "en" ? place.nameEn || place.name : place.name,
      displayDescription: language === "en" ? place.descriptionEn || place.description : place.description,
      displayImage: place.image ? imageUrl(place.image) : "",
      mapQuery: language === "en" ? place.addressEn || place.address || place.nameEn || place.name : place.address || place.name,
    })),
  ];

  return (
    <div className="container page-container">
      <section className="page-hero">
        <div>
          <span className="eyebrow"><Icon name="building" size={15} /> {t("पर्यटन स्थल")}</span>
          <h1>{t("इटहरीका पर्यटकीय स्थलहरू")}</h1>
          <p>{t("इटहरीका रमणीय स्थल र घुम्नलायक ठाउँहरू")}</p>
        </div>
      </section>
      {placesError && <p className="tourist-place-load-error" role="status">{t("थप पर्यटन स्थलहरू लोड गर्न सकिएन।")} {t(placesError)}</p>}
      <section className="tourist-place-grid" aria-label={t("पर्यटन स्थल")}>
        {visiblePlaces.map((place, index) => (
          <article className="tourist-place-card" key={place.key}>
            <div className="tourist-place-image-frame">
              {place.displayImage ? <Image
                src={place.displayImage}
                alt={place.displayName}
                fill
                sizes="(max-width: 680px) 100vw, (max-width: 900px) 50vw, 33vw"
                className="tourist-place-image"
                unoptimized
              /> : <div className="tourist-place-image-empty"><Icon name="building" size={38} /></div>}
              <span className="tourist-place-number">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="tourist-place-copy">
              <h2>{place.displayName}</h2>
              <p>{place.displayDescription}</p>
              <a
                className="tourist-place-map"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.mapQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("गुगल नक्सामा हेर्नुहोस्")}: ${place.displayName}`}
              >
                <Icon name="mapPin" size={17} />
                {t("गुगल नक्सामा हेर्नुहोस्")}
                <Icon name="arrow" size={15} />
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
