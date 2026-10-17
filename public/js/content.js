// Materi RuMa Shalat — tuntunan shalat madzhab Syafi'i seperti yang umum diajarkan di Indonesia.
// Setiap bacaan punya id unik; id ini juga dipakai sebagai nama file rekaman suara (audio/<id>.mp3).

export const R = {
  // ---------- bersuci ----------
  basmalah: {t:'Basmalah', ar:'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ', lat:'Bismillaahir rahmaanir rahiim', arti:'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.'},
  niat_wudhu: {t:'Niat Wudhu', ar:'نَوَيْتُ الْوُضُوْءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلّٰهِ تَعَالٰى', lat:"Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhal lillaahi ta'aalaa", arti:"Aku berniat wudhu untuk menghilangkan hadas kecil, fardhu karena Allah Ta'ala."},
  doa_wudhu: {t:'Doa Setelah Wudhu', ar:'أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُوْلُهُ، اَللّٰهُمَّ اجْعَلْنِيْ مِنَ التَّوَّابِيْنَ وَاجْعَلْنِيْ مِنَ الْمُتَطَهِّرِيْنَ', lat:"Asyhadu allaa ilaaha illallaahu wahdahuu laa syariika lah, wa asyhadu anna muhammadan 'abduhuu wa rasuuluh. Allaahummaj'alnii minat tawwaabiina waj'alnii minal mutathahhiriin", arti:'Aku bersaksi bahwa tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya, dan aku bersaksi bahwa Nabi Muhammad adalah hamba dan utusan-Nya. Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan orang-orang yang menyucikan diri.'},
  niat_tayamum: {t:'Niat Tayamum', ar:'نَوَيْتُ التَّيَمُّمَ لِاسْتِبَاحَةِ الصَّلَاةِ فَرْضًا لِلّٰهِ تَعَالٰى', lat:"Nawaitut tayammuma listibaahatish shalaati fardhal lillaahi ta'aalaa", arti:"Aku berniat tayamum agar diperbolehkan shalat, fardhu karena Allah Ta'ala."},

  // ---------- bacaan shalat ----------
  takbir: {t:'Takbiratul Ihram', ar:'اَللّٰهُ أَكْبَرُ', lat:'Allaahu akbar', arti:'Allah Maha Besar.'},
  takbir2: {t:'Takbir Pindah Gerakan', ar:'اَللّٰهُ أَكْبَرُ', lat:'Allaahu akbar', arti:'Allah Maha Besar.', note:"Dibaca setiap kali pindah gerakan, kecuali bangun dari ruku."},
  iftitah: {t:'Doa Iftitah', ar:'اَللّٰهُ أَكْبَرُ كَبِيْرًا وَالْحَمْدُ لِلّٰهِ كَثِيْرًا وَسُبْحَانَ اللّٰهِ بُكْرَةً وَأَصِيْلًا. إِنِّيْ وَجَّهْتُ وَجْهِيَ لِلَّذِيْ فَطَرَ السَّمٰوٰتِ وَالْأَرْضَ حَنِيْفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِيْنَ. إِنَّ صَلَاتِيْ وَنُسُكِيْ وَمَحْيَايَ وَمَمَاتِيْ لِلّٰهِ رَبِّ الْعٰلَمِيْنَ. لَا شَرِيْكَ لَهُ وَبِذٰلِكَ أُمِرْتُ وَأَنَا مِنَ الْمُسْلِمِيْنَ', lat:"Allaahu akbar kabiiraa, walhamdu lillaahi katsiiraa, wa subhaanallaahi bukratan wa ashiilaa. Innii wajjahtu wajhiya lilladzii fatharas samaawaati wal ardha haniifam muslimaw wa maa ana minal musyrikiin. Inna shalaatii wa nusukii wa mahyaaya wa mamaatii lillaahi rabbil 'aalamiin. Laa syariika lahuu wa bidzaalika umirtu wa ana minal muslimiin", arti:'Allah Maha Besar dengan sebesar-besarnya, segala puji yang banyak bagi Allah, Maha Suci Allah di waktu pagi dan petang. Aku hadapkan wajahku kepada Allah yang menciptakan langit dan bumi, dengan lurus dan berserah diri, dan aku bukan termasuk orang-orang musyrik. Sesungguhnya shalatku, ibadahku, hidupku, dan matiku hanya untuk Allah, Tuhan semesta alam. Tidak ada sekutu bagi-Nya. Dengan itulah aku diperintah, dan aku termasuk orang-orang muslim.', note:'Sunnah, dibaca setelah takbiratul ihram pada rakaat pertama saja.'},
  taawudz: {t:"Ta'awudz", ar:'أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ', lat:"A'uudzu billaahi minasy syaithaanir rajiim", arti:'Aku berlindung kepada Allah dari godaan setan yang terkutuk.', note:'Sunnah, dibaca pelan sebelum Al-Fatihah.'},
  aamiin: {t:'Aamiin', ar:'آمِيْنَ', lat:'Aamiin', arti:'Kabulkanlah, ya Allah.', note:'Dibaca setelah selesai Al-Fatihah.'},
  ruku: {t:'Bacaan Ruku', n:3, ar:'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ', lat:"Subhaana rabbiyal 'azhiimi wa bihamdih", arti:'Maha Suci Tuhanku Yang Maha Agung, dan dengan memuji-Nya.'},
  itidal1: {t:"Bangun dari Ruku", ar:'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ', lat:"Sami'allaahu liman hamidah", arti:'Allah Maha Mendengar orang yang memuji-Nya.', note:'Dibaca sambil bangun dari ruku dan mengangkat kedua tangan.'},
  itidal2: {t:"Bacaan I'tidal", ar:'رَبَّنَا لَكَ الْحَمْدُ مِلْءُ السَّمٰوٰتِ وَمِلْءُ الْأَرْضِ وَمِلْءُ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ', lat:"Rabbanaa lakal hamdu mil-us samaawaati wa mil-ul ardhi wa mil-u maa syi'ta min syai-in ba'du", arti:'Ya Tuhan kami, bagi-Mu segala puji, sepenuh langit, sepenuh bumi, dan sepenuh apa saja yang Engkau kehendaki sesudah itu.'},
  qunut: {t:'Doa Qunut', ar:'اَللّٰهُمَّ اهْدِنِيْ فِيْمَنْ هَدَيْتَ، وَعَافِنِيْ فِيْمَنْ عَافَيْتَ، وَتَوَلَّنِيْ فِيْمَنْ تَوَلَّيْتَ، وَبَارِكْ لِيْ فِيْمَا أَعْطَيْتَ، وَقِنِيْ شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِيْ وَلَا يُقْضٰى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، وَلَا يَعِزُّ مَنْ عَادَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ، فَلَكَ الْحَمْدُ عَلٰى مَا قَضَيْتَ، أَسْتَغْفِرُكَ وَأَتُوْبُ إِلَيْكَ، وَصَلَّى اللّٰهُ عَلٰى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْأُمِّيِّ وَعَلٰى آلِهِ وَصَحْبِهِ وَسَلَّمَ', lat:"Allaahummahdinii fiiman hadait, wa 'aafinii fiiman 'aafait, wa tawallanii fiiman tawallait, wa baarik lii fiimaa a'thait, wa qinii syarra maa qadhait, fa innaka taqdhii wa laa yuqdhaa 'alaik, wa innahuu laa yadzillu man waalait, wa laa ya'izzu man 'aadait, tabaarakta rabbanaa wa ta'aalait, falakal hamdu 'alaa maa qadhait, astaghfiruka wa atuubu ilaik, wa shallallaahu 'alaa sayyidinaa muhammadin nabiyyil ummiyyi wa 'alaa aalihii wa shahbihii wa sallam", arti:'Ya Allah, berilah aku petunjuk bersama orang-orang yang Engkau beri petunjuk, berilah aku keselamatan bersama orang-orang yang Engkau beri keselamatan, peliharalah aku bersama orang-orang yang Engkau pelihara, berkahilah apa yang Engkau berikan kepadaku, dan lindungilah aku dari keburukan yang Engkau tetapkan. Sesungguhnya Engkaulah yang menetapkan dan tidak ada yang menetapkan atas-Mu. Tidak akan hina orang yang Engkau lindungi, dan tidak akan mulia orang yang Engkau musuhi. Maha Suci Engkau, wahai Tuhan kami, dan Maha Tinggi Engkau. Segala puji bagi-Mu atas apa yang Engkau tetapkan. Aku memohon ampun dan bertaubat kepada-Mu. Semoga Allah melimpahkan rahmat dan keselamatan kepada junjungan kami Nabi Muhammad, Nabi yang ummi, beserta keluarga dan sahabatnya.', note:"Sunnah dalam madzhab Syafi'i: dibaca saat i'tidal rakaat kedua shalat Subuh, sambil mengangkat kedua tangan."},
  sujud: {t:'Bacaan Sujud', n:3, ar:'سُبْحَانَ رَبِّيَ الْأَعْلٰى وَبِحَمْدِهِ', lat:"Subhaana rabbiyal a'laa wa bihamdih", arti:'Maha Suci Tuhanku Yang Maha Tinggi, dan dengan memuji-Nya.'},
  duduk: {t:'Duduk di Antara Dua Sujud', ar:'رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ وَارْفَعْنِيْ وَارْزُقْنِيْ وَاهْدِنِيْ وَعَافِنِيْ وَاعْفُ عَنِّيْ', lat:"Rabbighfir lii warhamnii wajburnii warfa'nii warzuqnii wahdinii wa 'aafinii wa'fu 'annii", arti:'Ya Tuhanku, ampunilah aku, sayangilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.'},
  tasyahud: {t:'Bacaan Tasyahud', ar:'اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللّٰهِ', lat:"Attahiyyaatul mubaarakaatush shalawaatuth thayyibaatu lillaah. Assalaamu 'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu 'alainaa wa 'alaa 'ibaadillaahish shaalihiin. Asyhadu allaa ilaaha illallaah, wa asyhadu anna muhammadar rasuulullaah", arti:'Segala penghormatan, keberkahan, shalawat, dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat Allah, dan berkah-Nya tercurah kepadamu, wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang saleh. Aku bersaksi bahwa tidak ada Tuhan selain Allah, dan aku bersaksi bahwa Nabi Muhammad adalah utusan Allah.', note:'Jari telunjuk kanan diangkat ketika sampai pada kalimat "illallaah".'},
  shalawat_awal: {t:'Shalawat (Tasyahud Awal)', ar:'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ', lat:"Allaahumma shalli 'alaa muhammad", arti:'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad.'},
  shalawat_ibrahim: {t:'Shalawat Ibrahimiyah', ar:'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلٰى إِبْرَاهِيْمَ وَعَلٰى آلِ إِبْرَاهِيْمَ، وَبَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلٰى إِبْرَاهِيْمَ وَعَلٰى آلِ إِبْرَاهِيْمَ، فِي الْعٰلَمِيْنَ إِنَّكَ حَمِيْدٌ مَجِيْدٌ', lat:"Allaahumma shalli 'alaa muhammad wa 'alaa aali muhammad, kamaa shallaita 'alaa ibraahiim wa 'alaa aali ibraahiim, wa baarik 'alaa muhammad wa 'alaa aali muhammad, kamaa baarakta 'alaa ibraahiim wa 'alaa aali ibraahiim, fil 'aalamiina innaka hamiidum majiid", arti:'Ya Allah, limpahkanlah rahmat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau melimpahkan rahmat kepada Nabi Ibrahim dan keluarganya. Berkahilah Nabi Muhammad dan keluarganya, sebagaimana Engkau memberkahi Nabi Ibrahim dan keluarganya. Di seluruh alam, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.', note:'Dibaca pada tasyahud akhir. Membaca shalawat ini termasuk rukun shalat.'},
  doa_akhir: {t:'Doa Sebelum Salam', ar:'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيْحِ الدَّجَّالِ', lat:"Allaahumma innii a'uudzu bika min 'adzaabi jahannam, wa min 'adzaabil qabri, wa min fitnatil mahyaa wal mamaat, wa min syarri fitnatil masiihid dajjaal", arti:'Ya Allah, aku berlindung kepada-Mu dari siksa neraka Jahanam, dari siksa kubur, dari fitnah kehidupan dan kematian, dan dari jahatnya fitnah Dajjal.', note:'Sunnah, dibaca setelah shalawat pada tasyahud akhir.'},
  salam: {t:'Salam', ar:'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ', lat:"Assalaamu 'alaikum wa rahmatullaah", arti:'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.', note:'Menoleh ke kanan, lalu ke kiri.'},
  sujud_sahwi: {t:'Bacaan Sujud Sahwi', ar:'سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُوْ', lat:'Subhaana man laa yanaamu wa laa yashuu', arti:'Maha Suci Allah yang tidak pernah tidur dan tidak pernah lupa.'},
  takbir_id: {t:'Bacaan di Antara Takbir Shalat Id', ar:'سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَا إِلٰهَ إِلَّا اللّٰهُ وَاللّٰهُ أَكْبَرُ', lat:'Subhaanallaahi walhamdu lillaahi wa laa ilaaha illallaahu wallaahu akbar', arti:'Maha Suci Allah, segala puji bagi Allah, tidak ada Tuhan selain Allah, dan Allah Maha Besar.'},

  // ---------- niat shalat wajib ----------
  niat_subuh: {t:'Niat Shalat Subuh', ar:'أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhash shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Subuh dua rakaat, menghadap kiblat, tepat waktu, karena Allah Ta'ala."},
  niat_dzuhur: {t:'Niat Shalat Dzuhur', ar:'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhazh zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Dzuhur empat rakaat, menghadap kiblat, tepat waktu, karena Allah Ta'ala."},
  niat_ashar: {t:'Niat Shalat Ashar', ar:'أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Ashar empat rakaat, menghadap kiblat, tepat waktu, karena Allah Ta'ala."},
  niat_maghrib: {t:'Niat Shalat Maghrib', ar:'أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhal maghribi tsalaatsa raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Maghrib tiga rakaat, menghadap kiblat, tepat waktu, karena Allah Ta'ala."},
  niat_isya: {t:"Niat Shalat Isya", ar:'أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Isya empat rakaat, menghadap kiblat, tepat waktu, karena Allah Ta'ala."},
  niat_jumat: {t:"Niat Shalat Jumat", ar:'أُصَلِّيْ فَرْضَ الْجُمُعَةِ رَكْعَتَيْنِ مَأْمُوْمًا لِلّٰهِ تَعَالٰى', lat:"Ushallii fardhal jum'ati rak'ataini ma'muuman lillaahi ta'aalaa", arti:"Aku berniat shalat fardhu Jumat dua rakaat sebagai makmum karena Allah Ta'ala."},

  // ---------- niat shalat sunnah ----------
  niat_qabliyah_subuh: {t:'Niat Qabliyah Subuh', ar:'أُصَلِّيْ سُنَّةَ الصُّبْحِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatash shubhi rak'ataini qabliyyatan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah sebelum Subuh dua rakaat karena Allah Ta'ala."},
  niat_qabliyah_dzuhur: {t:'Niat Qabliyah Dzuhur', ar:'أُصَلِّيْ سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatazh zhuhri rak'ataini qabliyyatan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah sebelum Dzuhur dua rakaat karena Allah Ta'ala."},
  niat_badiyah_dzuhur: {t:"Niat Ba'diyah Dzuhur", ar:'أُصَلِّيْ سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatazh zhuhri rak'ataini ba'diyyatan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah sesudah Dzuhur dua rakaat karena Allah Ta'ala."},
  niat_badiyah_maghrib: {t:"Niat Ba'diyah Maghrib", ar:'أُصَلِّيْ سُنَّةَ الْمَغْرِبِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatal maghribi rak'ataini ba'diyyatan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah sesudah Maghrib dua rakaat karena Allah Ta'ala."},
  niat_badiyah_isya: {t:"Niat Ba'diyah Isya", ar:'أُصَلِّيْ سُنَّةَ الْعِشَاءِ رَكْعَتَيْنِ بَعْدِيَّةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatal 'isyaa-i rak'ataini ba'diyyatan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah sesudah Isya dua rakaat karena Allah Ta'ala."},
  niat_dhuha: {t:'Niat Shalat Dhuha', ar:'أُصَلِّيْ سُنَّةَ الضُّحٰى رَكْعَتَيْنِ لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatadh dhuhaa rak'ataini lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Dhuha dua rakaat karena Allah Ta'ala."},
  niat_tahajud: {t:'Niat Shalat Tahajud', ar:'أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatat tahajjudi rak'ataini lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Tahajud dua rakaat karena Allah Ta'ala."},
  niat_witir2: {t:'Niat Witir (2 Rakaat)', ar:'أُصَلِّيْ سُنَّةً مِنَ الْوِتْرِ رَكْعَتَيْنِ لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatan minal witri rak'ataini lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah bagian dari Witir dua rakaat karena Allah Ta'ala."},
  niat_witir: {t:'Niat Witir (1 Rakaat)', ar:'أُصَلِّيْ سُنَّةَ الْوِتْرِ رَكْعَةً لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatal witri rak'atan lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Witir satu rakaat karena Allah Ta'ala."},
  niat_tarawih: {t:'Niat Shalat Tarawih', ar:'أُصَلِّيْ سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ مَأْمُوْمًا لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatat taraawiihi rak'ataini ma'muuman lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Tarawih dua rakaat sebagai makmum karena Allah Ta'ala."},
  niat_tahiyat: {t:'Niat Tahiyatul Masjid', ar:'أُصَلِّيْ سُنَّةَ تَحِيَّةِ الْمَسْجِدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnata tahiyyatil masjidi rak'ataini lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Tahiyatul Masjid dua rakaat karena Allah Ta'ala."},
  niat_idulfitri: {t:'Niat Shalat Idul Fitri', ar:'أُصَلِّيْ سُنَّةً لِعِيْدِ الْفِطْرِ رَكْعَتَيْنِ مَأْمُوْمًا لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatan li'iidil fithri rak'ataini ma'muuman lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Idul Fitri dua rakaat sebagai makmum karena Allah Ta'ala."},
  niat_iduladha: {t:'Niat Shalat Idul Adha', ar:'أُصَلِّيْ سُنَّةً لِعِيْدِ الْأَضْحٰى رَكْعَتَيْنِ مَأْمُوْمًا لِلّٰهِ تَعَالٰى', lat:"Ushallii sunnatan li'iidil adh-haa rak'ataini ma'muuman lillaahi ta'aalaa", arti:"Aku berniat shalat sunnah Idul Adha dua rakaat sebagai makmum karena Allah Ta'ala."},
  niat_jenazah: {t:'Niat Shalat Jenazah', ar:'أُصَلِّيْ عَلٰى هٰذَا الْمَيِّتِ أَرْبَعَ تَكْبِيْرَاتٍ فَرْضَ كِفَايَةٍ مَأْمُوْمًا لِلّٰهِ تَعَالٰى', lat:"Ushallii 'alaa haadzal mayyiti arba'a takbiiraatin fardha kifaayatin ma'muuman lillaahi ta'aalaa", arti:"Aku berniat shalat atas jenazah ini empat takbir, fardhu kifayah, sebagai makmum karena Allah Ta'ala."},

  // ---------- dzikir ----------
  istighfar: {t:'Istighfar', n:3, ar:'أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ', lat:"Astaghfirullaahal 'azhiim", arti:'Aku memohon ampun kepada Allah Yang Maha Agung.'},
  antassalam: {t:'Allaahumma Antas Salaam', ar:'اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', lat:'Allaahumma antas salaam wa minkas salaam, tabaarakta yaa dzal jalaali wal ikraam', arti:'Ya Allah, Engkaulah Maha Pemberi keselamatan, dan dari-Mu datang keselamatan. Maha Suci Engkau, wahai Tuhan Yang Maha Agung dan Maha Mulia.'},
  tasbih: {t:'Tasbih', n:33, ar:'سُبْحَانَ اللّٰهِ', lat:'Subhaanallaah', arti:'Maha Suci Allah.'},
  tahmid: {t:'Tahmid', n:33, ar:'اَلْحَمْدُ لِلّٰهِ', lat:'Alhamdulillaah', arti:'Segala puji bagi Allah.'},
  takbir33: {t:'Takbir', n:33, ar:'اَللّٰهُ أَكْبَرُ', lat:'Allaahu akbar', arti:'Allah Maha Besar.'},
  tahlil: {t:'Tahlil', ar:'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ', lat:"Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu wa huwa 'alaa kulli syai-in qadiir", arti:'Tidak ada Tuhan selain Allah Yang Maha Esa, tidak ada sekutu bagi-Nya. Milik-Nya kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu.', note:'Penutup tasbih, tahmid, dan takbir sehingga genap 100.'},
};

// ---------- doa harian ----------
export const DOA = [
  {id:'d_makan', ic:'🍽️', sit:'Mau makan', t:'Doa Sebelum Makan', ar:'اَللّٰهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ', lat:"Allaahumma baarik lanaa fiimaa razaqtanaa wa qinaa 'adzaaban naar", arti:'Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami, dan peliharalah kami dari siksa api neraka.'},
  {id:'d_sesudah_makan', ic:'😋', sit:'Selesai makan', t:'Doa Sesudah Makan', ar:'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ', lat:"Alhamdulillaahil ladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin", arti:'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami orang-orang muslim.'},
  {id:'d_tidur', ic:'🛏️', sit:'Mau tidur', t:'Doa Sebelum Tidur', ar:'بِاسْمِكَ اللّٰهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوْتُ', lat:'Bismikallaahumma ahyaa wa bismika amuut', arti:'Dengan nama-Mu ya Allah aku hidup, dan dengan nama-Mu aku mati.'},
  {id:'d_bangun', ic:'🌅', sit:'Bangun tidur', t:'Doa Bangun Tidur', ar:'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ', lat:"Alhamdulillaahil ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin nusyuur", arti:'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami kembali.'},
  {id:'d_masuk_wc', ic:'🚽', sit:'Masuk kamar mandi', t:'Doa Masuk Kamar Mandi', ar:'اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', lat:"Allaahumma innii a'uudzu bika minal khubutsi wal khabaa-its", arti:'Ya Allah, aku berlindung kepada-Mu dari setan laki-laki dan setan perempuan.', note:'Masuk dengan kaki kiri.'},
  {id:'d_keluar_wc', ic:'🚿', sit:'Keluar kamar mandi', t:'Doa Keluar Kamar Mandi', ar:'غُفْرَانَكَ', lat:'Ghufraanaka', arti:'Aku memohon ampunan-Mu.', note:'Keluar dengan kaki kanan.'},
  {id:'d_keluar_rumah', ic:'🚶', sit:'Keluar rumah', t:'Doa Keluar Rumah', ar:'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', lat:"Bismillaahi tawakkaltu 'alallaah, laa haula wa laa quwwata illaa billaah", arti:'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.'},
  {id:'d_masuk_rumah', ic:'🏠', sit:'Masuk rumah', t:'Doa Masuk Rumah', ar:'بِسْمِ اللّٰهِ وَلَجْنَا، وَبِسْمِ اللّٰهِ خَرَجْنَا، وَعَلَى اللّٰهِ رَبِّنَا تَوَكَّلْنَا', lat:"Bismillaahi walajnaa, wa bismillaahi kharajnaa, wa 'alallaahi rabbinaa tawakkalnaa", arti:'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal.', note:"Lalu ucapkan salam: Assalaamu'alaikum."},
  {id:'d_ortu', ic:'👨‍👩‍👧', sit:'Doakan orang tua', t:'Doa untuk Orang Tua', ar:'رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا', lat:'Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa', arti:'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka menyayangiku di waktu kecil.'},
  {id:'d_belajar', ic:'📚', sit:'Mau belajar', t:'Doa Sebelum Belajar', ar:'رَبِّ زِدْنِيْ عِلْمًا وَارْزُقْنِيْ فَهْمًا', lat:"Rabbi zidnii 'ilmaa warzuqnii fahmaa", arti:'Ya Tuhanku, tambahkanlah ilmuku dan berilah aku pemahaman.'},
  {id:'d_masuk_masjid', ic:'🕌', sit:'Masuk masjid', t:'Doa Masuk Masjid', ar:'اَللّٰهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ', lat:'Allaahummaftah lii abwaaba rahmatik', arti:'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', note:'Masuk dengan kaki kanan.'},
  {id:'d_keluar_masjid', ic:'👣', sit:'Keluar masjid', t:'Doa Keluar Masjid', ar:'اَللّٰهُمَّ إِنِّيْ أَسْأَلُكَ مِنْ فَضْلِكَ', lat:'Allaahumma innii as-aluka min fadhlik', arti:'Ya Allah, aku memohon karunia-Mu.', note:'Keluar dengan kaki kiri.'},
  {id:'d_kendaraan', ic:'🚗', sit:'Naik kendaraan', t:'Doa Naik Kendaraan', ar:'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلٰى رَبِّنَا لَمُنْقَلِبُوْنَ', lat:'Subhaanal ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun', arti:'Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal sebelumnya kami tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.', note:'QS. Az-Zukhruf: 13–14. Diawali dengan Bismillah.'},
  {id:'d_pakaian', ic:'👕', sit:'Memakai pakaian', t:'Doa Memakai Pakaian', ar:'اَلْحَمْدُ لِلّٰهِ الَّذِيْ كَسَانِيْ هٰذَا وَرَزَقَنِيْهِ مِنْ غَيْرِ حَوْلٍ مِنِّيْ وَلَا قُوَّةٍ', lat:'Alhamdulillaahil ladzii kasaanii haadzaa wa razaqaniihi min ghairi haulim minnii wa laa quwwah', arti:'Segala puji bagi Allah yang telah memberiku pakaian ini dan memberikannya kepadaku tanpa daya dan kekuatan dariku.'},
  {id:'d_cermin', ic:'🪞', sit:'Bercermin', t:'Doa Bercermin', ar:'اَللّٰهُمَّ كَمَا حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ', lat:'Allaahumma kamaa hassanta khalqii fahassin khuluqii', arti:'Ya Allah, sebagaimana Engkau telah membaguskan rupaku, maka baguskanlah akhlakku.'},
  {id:'d_bersin', ic:'🤧', sit:'Bersin', t:'Doa Ketika Bersin', ar:'اَلْحَمْدُ لِلّٰهِ', lat:'Alhamdulillaah', arti:'Segala puji bagi Allah.', note:'Yang mendengar menjawab: "Yarhamukallaah" (semoga Allah menyayangimu). Lalu yang bersin membalas: "Yahdiikumullaahu wa yushlihu baalakum" (semoga Allah memberimu petunjuk dan memperbaiki keadaanmu).'},
  {id:'d_marah', ic:'😤', sit:'Ketika marah', t:'Doa Ketika Marah', ar:'أَعُوْذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيْمِ', lat:"A'uudzu billaahi minasy syaithaanir rajiim", arti:'Aku berlindung kepada Allah dari godaan setan yang terkutuk.', note:'Kalau sedang berdiri, duduklah. Kalau masih marah, berwudhulah.'},
  {id:'d_hujan', ic:'🌧️', sit:'Turun hujan', t:'Doa Ketika Hujan', ar:'اَللّٰهُمَّ صَيِّبًا نَافِعًا', lat:"Allaahumma shayyiban naafi'aa", arti:'Ya Allah, turunkanlah hujan yang bermanfaat.'},
  {id:'d_sapujagat', ic:'🌍', sit:'Kebaikan dunia akhirat', t:'Doa Kebaikan Dunia Akhirat', ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', lat:"Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar", arti:'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka.', note:'QS. Al-Baqarah: 201.'},
];
DOA.forEach(d => { R[d.id] = d; });

// ---------- wudhu ----------
export const WUDHU = [
  {ic:'💭', t:'Niat & Bismillah', d:'Niatkan di dalam hati bahwa kamu mau berwudhu, lalu baca Bismillah.', hk:'Fardhu (niat)', read:['basmalah','niat_wudhu'], tip:"Menurut madzhab Syafi'i, niat di dalam hati dilakukan bersamaan saat pertama kali membasuh muka."},
  {ic:'🙌', t:'Cuci Kedua Telapak Tangan', d:'Basuh kedua telapak tangan sampai pergelangan, sela-sela jarinya juga.', n:3, hk:'Sunnah'},
  {ic:'👄', t:'Berkumur', d:'Masukkan air ke mulut, kumur-kumur, lalu buang.', n:3, hk:'Sunnah'},
  {ic:'👃', t:'Membersihkan Hidung', d:'Hirup sedikit air ke hidung, lalu keluarkan lagi pelan-pelan.', n:3, hk:'Sunnah'},
  {ic:'😊', t:'Membasuh Muka', d:'Basuh seluruh muka: dari tempat tumbuh rambut sampai dagu, dan dari telinga kanan sampai telinga kiri.', n:3, hk:'Fardhu', tip:'Bersamaan dengan basuhan pertama ini, niat wudhu di dalam hati.'},
  {ic:'💪', t:'Membasuh Tangan sampai Siku', d:'Basuh tangan kanan dulu sampai siku, lalu tangan kiri.', n:3, hk:'Fardhu'},
  {ic:'💆', t:'Mengusap Kepala', d:'Usap kepala dengan tangan yang basah. Paling sedikit sebagian kepala.', n:3, hk:'Fardhu'},
  {ic:'👂', t:'Mengusap Telinga', d:'Usap bagian dalam dan belakang kedua telinga.', n:3, hk:'Sunnah'},
  {ic:'🦶', t:'Membasuh Kaki sampai Mata Kaki', d:'Basuh kaki kanan dulu sampai mata kaki, sela-sela jari kaki juga, lalu kaki kiri.', n:3, hk:'Fardhu'},
  {ic:'🤲', t:'Berdoa Setelah Wudhu', d:'Menghadap kiblat, lalu baca doa setelah wudhu.', hk:'Sunnah', read:['doa_wudhu'], tip:'Semua langkah dilakukan berurutan (tertib). Tertib juga termasuk fardhu wudhu.'},
];
export const FARDHU_WUDHU = [
  ['💭','Niat','Di dalam hati, bersamaan dengan membasuh muka.'],
  ['😊','Membasuh muka',''],
  ['💪','Membasuh kedua tangan sampai siku',''],
  ['💆','Mengusap sebagian kepala',''],
  ['🦶','Membasuh kedua kaki sampai mata kaki',''],
  ['🔢','Tertib','Dilakukan berurutan, tidak boleh dibolak-balik.'],
];
export const SUNNAH_WUDHU = [
  ['🪥','Bersiwak atau sikat gigi sebelum wudhu'],['📖','Membaca Bismillah'],['🙌','Membasuh kedua telapak tangan'],['👄','Berkumur'],['👃','Membersihkan hidung'],
  ['💆','Mengusap seluruh kepala'],['👂','Mengusap kedua telinga'],['👉','Mendahulukan anggota yang kanan'],['3️⃣','Mengulang setiap basuhan 3 kali'],['🖐️','Menyela-nyela jari tangan dan kaki'],['🤲','Berdoa setelah wudhu'],
];
export const PEMBATAL_WUDHU = [
  ['💨','Keluar sesuatu dari kemaluan atau dubur','Misalnya buang air kecil, buang air besar, atau kentut.'],
  ['😴','Tidur nyenyak','Kecuali tidur sambil duduk yang rapat di lantai.'],
  ['😵','Hilang akal','Misalnya pingsan atau mabuk.'],
  ['🤝','Bersentuhan kulit laki-laki dan perempuan','Yang sudah dewasa dan bukan mahram, tanpa penghalang (madzhab Syafi\'i).'],
  ['✋','Menyentuh kemaluan dengan telapak tangan','Tanpa penghalang.'],
];
export const TAYAMUM = {
  kapan: ['Tidak ada air sama sekali','Sedang sakit dan tidak boleh terkena air','Air hanya cukup untuk minum'],
  langkah: [
    ['🪨','Siapkan debu atau tanah yang suci'],
    ['📖','Baca Bismillah'],
    ['🖐️','Tepukkan kedua telapak tangan ke debu, lalu tiup pelan'],
    ['😊','Usap muka sambil berniat tayamum di dalam hati'],
    ['🖐️','Tepukkan lagi kedua telapak tangan ke debu'],
    ['💪','Usap tangan kanan lalu tangan kiri sampai siku'],
  ],
  note:"Menurut madzhab Syafi'i, satu kali tayamum hanya untuk satu shalat fardhu. Jika sudah menemukan air, wajib berwudhu.",
};

// ---------- gerakan shalat (urutan dasar) ----------
export const GERAKAN = [
  {pose:'stand', t:'Berdiri Menghadap Kiblat', d:'Berdiri tegak menghadap kiblat, kaki sedikit renggang, pandangan ke tempat sujud. Niatkan shalat di dalam hati.', tip:'Lafaz niat setiap shalat ada di menu Jenis Shalat.'},
  {pose:'takbir', t:'Takbiratul Ihram', d:'Angkat kedua tangan sejajar telinga, telapak tangan menghadap kiblat, sambil mengucapkan "Allaahu akbar".', read:['takbir']},
  {pose:'sedekap', t:'Bersedekap', d:'Letakkan tangan kanan di atas tangan kiri, di bawah dada dan di atas pusar. Baca doa iftitah, Al-Fatihah, lalu surat pendek.', read:['iftitah','taawudz','q:fatihah','aamiin']},
  {pose:'ruku', t:'Ruku', d:'Membungkuk sampai punggung dan kepala lurus rata. Kedua telapak tangan memegang lutut. Diam sejenak (tuma\'ninah).', read:['ruku']},
  {pose:'stand', t:"I'tidal", d:"Bangun dari ruku sambil mengangkat kedua tangan, lalu berdiri tegak dengan tangan lurus di samping badan.", read:['itidal1','itidal2']},
  {pose:'sujud', t:'Sujud', d:'Turun bersujud. Tujuh anggota menempel ke lantai: dahi (bersama hidung), kedua telapak tangan, kedua lutut, dan ujung jari kedua kaki.', read:['sujud']},
  {pose:'duduk', t:'Duduk di Antara Dua Sujud', d:'Duduk di atas kaki kiri (duduk iftirasy), telapak kaki kanan ditegakkan, kedua tangan di atas paha.', read:['duduk']},
  {pose:'sujud', t:'Sujud Kedua', d:'Sujud lagi seperti sujud yang pertama. Setelah itu bangun untuk rakaat berikutnya.', read:['sujud']},
  {pose:'tasyahud', t:'Tasyahud Awal', d:'Pada rakaat kedua (untuk shalat 3 atau 4 rakaat), duduk iftirasy dan baca tasyahud awal.', read:['tasyahud','shalawat_awal']},
  {pose:'tawarruk', t:'Tasyahud Akhir', d:'Pada rakaat terakhir, duduk tawarruk: pantat kiri menempel lantai, kaki kiri dikeluarkan ke bawah kaki kanan. Baca tasyahud akhir dan shalawat.', read:['tasyahud','shalawat_ibrahim','doa_akhir']},
  {pose:'salamR', t:'Salam ke Kanan', d:'Menoleh ke kanan sambil mengucapkan salam.', read:['salam']},
  {pose:'salamL', t:'Salam ke Kiri', d:'Menoleh ke kiri sambil mengucapkan salam. Alhamdulillah, shalat selesai!', read:['salam']},
];

// ---------- bacaan shalat (urutan halaman Bacaan) ----------
export const BACAAN = [
  {h:'Pembuka', ids:['takbir','iftitah','taawudz']},
  {h:'Al-Fatihah & Surat Pendek', ids:['q:fatihah','aamiin','q:surat']},
  {h:"Ruku & I'tidal", ids:['ruku','itidal1','itidal2','qunut']},
  {h:'Sujud & Duduk', ids:['sujud','duduk']},
  {h:'Tasyahud & Salam', ids:['tasyahud','shalawat_awal','shalawat_ibrahim','doa_akhir','salam']},
];

// ---------- jenis shalat ----------
export const WAJIB = [
  {k:'subuh', t:'Subuh', ic:'🌅', rk:2, waktu:'Sejak terbit fajar (langit timur mulai terang) sampai sebelum matahari terbit.', baca:'Al-Fatihah dan surat dibaca keras di kedua rakaat.', niat:['niat_subuh'], note:"Dalam madzhab Syafi'i disunnahkan membaca doa qunut pada i'tidal rakaat kedua."},
  {k:'dzuhur', t:'Dzuhur', ic:'☀️', rk:4, waktu:'Sejak matahari tergelincir ke barat (lewat tengah hari) sampai bayangan benda sama panjang dengan bendanya.', baca:'Semua bacaan dibaca pelan.', niat:['niat_dzuhur'], note:'Hari Jumat, anak laki-laki yang sudah baligh menggantinya dengan shalat Jumat.'},
  {k:'ashar', t:'Ashar', ic:'🌤️', rk:4, waktu:'Sejak bayangan benda sama panjang dengan bendanya sampai matahari terbenam. Jangan ditunda sampai matahari menguning.', baca:'Semua bacaan dibaca pelan.', niat:['niat_ashar']},
  {k:'maghrib', t:'Maghrib', ic:'🌇', rk:3, waktu:'Sejak matahari terbenam sampai hilangnya mega merah di langit barat.', baca:'Rakaat 1 dan 2 dibaca keras, rakaat 3 pelan.', niat:['niat_maghrib']},
  {k:'isya', t:'Isya', ic:'🌙', rk:4, waktu:'Sejak hilangnya mega merah sampai terbit fajar. Lebih utama tidak ditunda sampai larut malam.', baca:'Rakaat 1 dan 2 dibaca keras, rakaat 3 dan 4 pelan.', niat:['niat_isya']},
  {k:'jumat', t:'Jumat', ic:'🕌', rk:2, waktu:'Hari Jumat di waktu Dzuhur, berjamaah di masjid setelah mendengarkan dua khutbah.', baca:'Al-Fatihah dan surat dibaca keras oleh imam.', niat:['niat_jumat'], note:'Wajib bagi laki-laki muslim yang baligh, berakal, sehat, dan tidak sedang bepergian jauh. Shalat Jumat menggantikan shalat Dzuhur.'},
];
export const SUNNAH = [
  {k:'rawatib', t:"Rawatib", ic:'🔁', rk:'2', waktu:"Qabliyah dikerjakan sebelum shalat wajib, ba'diyah sesudahnya.", hukum:"Sunnah muakkad (sangat dianjurkan) ada 10 rakaat: 2 sebelum Subuh, 2 sebelum Dzuhur, 2 sesudah Dzuhur, 2 sesudah Maghrib, dan 2 sesudah Isya.", niat:['niat_qabliyah_subuh','niat_qabliyah_dzuhur','niat_badiyah_dzuhur','niat_badiyah_maghrib','niat_badiyah_isya']},
  {k:'dhuha', t:'Dhuha', ic:'🌞', rk:'2–8', waktu:'Pagi hari, sejak matahari naik kira-kira setinggi tombak (±15–20 menit setelah terbit) sampai sebelum Dzuhur.', hukum:'Sunnah. Paling sedikit 2 rakaat, setiap 2 rakaat salam.', niat:['niat_dhuha']},
  {k:'tahajud', t:'Tahajud', ic:'🌌', rk:'2+', waktu:'Malam hari setelah bangun tidur sampai sebelum Subuh. Paling utama di sepertiga malam terakhir.', hukum:'Sunnah. Paling sedikit 2 rakaat, setiap 2 rakaat salam.', niat:['niat_tahajud']},
  {k:'witir', t:'Witir', ic:'✨', rk:'1–11', waktu:'Setelah shalat Isya sampai sebelum Subuh. Menjadi penutup shalat malam.', hukum:'Sunnah muakkad. Jumlah rakaatnya ganjil: 1, 3, 5, sampai 11.', niat:['niat_witir2','niat_witir'], note:'Kalau 3 rakaat: shalat 2 rakaat lalu salam, kemudian 1 rakaat lalu salam.'},
  {k:'tarawih', t:'Tarawih', ic:'🏮', rk:'8 / 20', waktu:'Malam hari di bulan Ramadhan, setelah shalat Isya.', hukum:'Sunnah muakkad, utama dikerjakan berjamaah. Setiap 2 rakaat salam, lalu ditutup dengan witir.', niat:['niat_tarawih']},
  {k:'tahiyat', t:'Tahiyatul Masjid', ic:'🕌', rk:'2', waktu:'Saat masuk masjid, sebelum duduk.', hukum:'Sunnah, sebagai penghormatan kepada masjid.', niat:['niat_tahiyat']},
  {k:'idulfitri', t:'Idul Fitri', ic:'🌙', rk:'2', waktu:'Pagi hari tanggal 1 Syawal, setelah matahari naik sampai sebelum Dzuhur.', hukum:'Sunnah muakkad, berjamaah di masjid atau lapangan, lalu mendengarkan khutbah.', niat:['niat_idulfitri','takbir_id'], note:'Rakaat 1: takbir 7 kali setelah doa iftitah. Rakaat 2: takbir 5 kali sebelum Al-Fatihah. Di antara takbir membaca tasbih.'},
  {k:'iduladha', t:'Idul Adha', ic:'🐐', rk:'2', waktu:'Pagi hari tanggal 10 Dzulhijjah.', hukum:'Sunnah muakkad. Tata caranya sama dengan shalat Idul Fitri.', niat:['niat_iduladha','takbir_id']},
  {k:'jenazah', t:'Jenazah', ic:'🤍', rk:'4 takbir', waktu:'Ketika ada orang muslim yang meninggal dunia, sebelum dimakamkan.', hukum:'Fardhu kifayah (cukup sebagian orang yang mengerjakan). Dikerjakan sambil berdiri, tanpa ruku dan sujud.', niat:['niat_jenazah'], note:'Setelah takbir 1: Al-Fatihah. Takbir 2: shalawat Nabi. Takbir 3: doa untuk jenazah. Takbir 4: doa, lalu salam. Untuk jenazah perempuan dibaca "haadzihil mayyitati".'},
];

// ---------- syarat & rukun ----------
export const SYARAT_WAJIB = [
  ['☪️','Beragama Islam',''],
  ['🧑','Baligh (sudah dewasa)','Tandanya: sudah bermimpi basah (laki-laki), sudah haid (perempuan), atau sudah berumur 15 tahun Hijriah.'],
  ['🧠','Berakal sehat',''],
  ['🌸','Suci dari haid dan nifas','Khusus untuk perempuan.'],
  ['📢','Sudah sampai ajaran Islam kepadanya',''],
];
export const SYARAT_SAH = [
  ['💧','Suci dari hadas','Hadas kecil disucikan dengan wudhu, hadas besar dengan mandi wajib.'],
  ['🧼','Suci badan, pakaian, dan tempat dari najis','Misalnya bersih dari air kencing dan kotoran.'],
  ['👕','Menutup aurat','Laki-laki: antara pusar sampai lutut. Perempuan: seluruh tubuh kecuali wajah dan kedua telapak tangan.'],
  ['🕋','Menghadap kiblat','Kiblat adalah Ka\'bah di Makkah. Dari Indonesia arahnya ke barat laut.'],
  ['⏰','Sudah masuk waktu shalat',''],
  ['📘','Mengetahui tata cara shalat','Tahu mana yang rukun (wajib) dan mana yang sunnah.'],
];
export const RUKUN = [
  ['💭','Niat','Di dalam hati, bersamaan dengan takbiratul ihram.'],
  ['🧍','Berdiri bagi yang mampu','Untuk shalat fardhu. Kalau sakit boleh sambil duduk atau berbaring.'],
  ['🙌','Takbiratul ihram','Mengucapkan "Allaahu akbar" di awal shalat.'],
  ['📖','Membaca Al-Fatihah','Di setiap rakaat.'],
  ['🙇','Ruku dengan tuma\'ninah',''],
  ['🧍','I\'tidal dengan tuma\'ninah',''],
  ['🧎','Sujud dua kali dengan tuma\'ninah',''],
  ['🧘','Duduk di antara dua sujud dengan tuma\'ninah',''],
  ['🧘','Duduk tasyahud akhir',''],
  ['💬','Membaca tasyahud akhir',''],
  ['💚','Membaca shalawat Nabi','Pada tasyahud akhir.'],
  ['👋','Salam yang pertama','Salam ke kanan.'],
  ['🔢','Tertib','Semua rukun dikerjakan berurutan.'],
];
export const TUMAKNINAH = "Tuma'ninah artinya diam sejenak sampai semua anggota badan tenang, kira-kira selama membaca \"Subhaanallaah\".";
export const SUNNAH_ABAD = ['Membaca tasyahud awal','Duduk tasyahud awal','Membaca shalawat Nabi pada tasyahud awal','Membaca doa qunut pada shalat Subuh'];
export const SUNNAH_HAIAT = ['Mengangkat kedua tangan saat takbiratul ihram, ruku, i\'tidal, dan berdiri dari tasyahud awal','Bersedekap (tangan kanan di atas tangan kiri)','Membaca doa iftitah','Membaca ta\'awudz sebelum Al-Fatihah','Membaca "Aamiin" setelah Al-Fatihah','Membaca surat setelah Al-Fatihah pada rakaat 1 dan 2','Membaca takbir setiap pindah gerakan','Membaca tasbih saat ruku dan sujud','Duduk iftirasy dan duduk tawarruk','Memandang tempat sujud','Salam yang kedua (ke kiri)'];
export const PEMBATAL_SHALAT = [
  ['💨','Berhadas','Misalnya kentut atau buang air.'],
  ['🚫','Terkena najis','Yang tidak dimaafkan dan tidak segera dibuang.'],
  ['🗣️','Berbicara dengan sengaja',''],
  ['🍪','Makan atau minum',''],
  ['🏃','Banyak bergerak','Tiga gerakan besar berturut-turut di luar gerakan shalat.'],
  ['😂','Tertawa terbahak-bahak',''],
  ['👀','Terbuka aurat','Dan tidak segera ditutup.'],
  ['↩️','Membelakangi kiblat',''],
  ['❌','Meninggalkan rukun dengan sengaja',''],
  ['💭','Berniat keluar dari shalat',''],
];
export const SAHWI = {
  apa:'Sujud sahwi adalah dua kali sujud karena lupa di dalam shalat. Dikerjakan setelah tasyahud akhir, sebelum salam (madzhab Syafi\'i).',
  sebab:['Lupa mengerjakan sunnah ab\'adh, misalnya lupa tasyahud awal','Ragu-ragu jumlah rakaat: ambil yang paling sedikit, lalu sempurnakan','Kelebihan gerakan karena lupa, misalnya ruku dua kali'],
};

// ---------- dzikir setelah shalat ----------
export const DZIKIR = [
  {id:'istighfar', n:3},
  {id:'antassalam', n:1},
  {id:'q:kursi', n:1},
  {id:'tasbih', n:33},
  {id:'tahmid', n:33},
  {id:'takbir33', n:33},
  {id:'tahlil', n:1},
  {id:'d_sapujagat', n:1},
  {id:'d_ortu', n:1},
];

// ---------- kuis ----------
// lv: 1 = mudah (4–6 th), 2 = sedang (7–9 th), 3 = sulit (10–12 th)
// o: pilihan (jawaban benar selalu ditulis pertama; urutan diacak saat tampil). ex: penjelasan.
// pose: tampilkan gambar gerakan. poses: pilihan berupa gambar. ar: tampilkan teks Arab. order: susun urutan.
export const QUIZ = [
  // ===== MUDAH =====
  {lv:1, q:'Gerakan apa ini?', pose:'sujud', o:['Sujud','Ruku','Berdiri']},
  {lv:1, q:'Gerakan apa ini?', pose:'ruku', o:['Ruku','Sujud','Duduk']},
  {lv:1, q:'Gerakan apa ini?', pose:'takbir', o:['Takbiratul ihram','Salam','Sujud']},
  {lv:1, q:'Gerakan apa ini?', pose:'duduk', o:['Duduk','Ruku','Berdiri']},
  {lv:1, q:'Mana gambar sujud?', poses:['sujud','ruku','sedekap']},
  {lv:1, q:'Mana gambar ruku?', poses:['ruku','duduk','takbir']},
  {lv:1, q:'Mana gambar takbiratul ihram?', poses:['takbir','sujud','duduk']},
  {lv:1, q:'Sebelum shalat, kita harus...', o:['💧 Berwudhu','🍽️ Makan','🛏️ Tidur'], big:true},
  {lv:1, q:'Wudhu memakai...', o:['💧 Air bersih','🥛 Susu','🧃 Jus'], big:true},
  {lv:1, q:'Shalat wajib dalam sehari ada berapa kali?', o:['5','3','7'], num:true},
  {lv:1, q:'Shalat Subuh berapa rakaat?', o:['2','3','4'], num:true},
  {lv:1, q:'Shalat Maghrib berapa rakaat?', o:['3','2','4'], num:true},
  {lv:1, q:'Shalat Dzuhur berapa rakaat?', o:['4','2','3'], num:true},
  {lv:1, q:'Saat shalat, kita menghadap ke...', o:['🕋 Kiblat (Ka\'bah)','📺 Televisi','🪟 Jendela'], big:true},
  {lv:1, q:'Shalat dimulai dengan mengucapkan...', o:['Allaahu akbar',"Assalaamu'alaikum",'Alhamdulillaah']},
  {lv:1, q:'Shalat diakhiri dengan...', o:['Salam','Ruku','Takbir']},
  {lv:1, q:'Shalat yang dikerjakan saat matahari terbenam adalah...', o:['Maghrib','Subuh','Dzuhur']},
  {lv:1, q:'Shalat yang paling pagi adalah...', o:['Subuh','Isya','Ashar']},
  {lv:1, q:'Shalat yang dikerjakan malam hari sebelum tidur adalah...', o:['Isya','Dhuha','Subuh']},
  {lv:1, q:'Bolehkah mengobrol saat shalat?', o:['Tidak boleh','Boleh','Boleh kalau pelan']},
  {lv:1, q:'Surat yang dibaca di setiap rakaat adalah...', o:['Al-Fatihah','An-Nas','Al-Ikhlas']},
  {lv:1, q:'Tempat shalat berjamaah kaum muslimin adalah...', o:['🕌 Masjid','🏫 Sekolah','🏪 Toko'], big:true},
  {lv:1, q:'Alas untuk shalat namanya...', o:['Sajadah','Selimut','Handuk']},
  {lv:1, q:'Pakaian shalat untuk anak perempuan adalah...', o:['Mukena','Jas hujan','Kaos bola']},
  {lv:1, q:'Saat sujud, bagian tubuh yang menempel di lantai adalah...', o:['Dahi (kening)','Punggung','Telinga']},
  {lv:1, q:'Sebelum wudhu kita membaca...', o:['Bismillah','Alhamdulillah','Aamiin']},
  {lv:1, q:'Apa arti "Allaahu akbar"?', o:['Allah Maha Besar','Allah Maha Pengasih','Segala puji bagi Allah']},
  {lv:1, q:'Saat wudhu, yang dibasuh lebih dulu adalah anggota yang...', o:['Kanan','Kiri','Mana saja']},
  {lv:1, q:'Selesai shalat, sebaiknya kita...', o:['🤲 Berdzikir dan berdoa','🏃 Langsung lari','📱 Main HP'], big:true},

  // ===== SEDANG =====
  {lv:2, q:'Jumlah rakaat semua shalat wajib dalam sehari adalah...', o:['17','15','20'], num:true, ex:'Subuh 2 + Dzuhur 4 + Ashar 4 + Maghrib 3 + Isya 4 = 17 rakaat.'},
  {lv:2, q:'Shalat Ashar berapa rakaat?', o:['4','3','2'], num:true},
  {lv:2, q:'Shalat Isya berapa rakaat?', o:['4','3','2'], num:true},
  {lv:2, q:'Shalat Jumat berapa rakaat?', o:['2','4','3'], num:true, ex:'Shalat Jumat 2 rakaat dan menggantikan shalat Dzuhur.'},
  {lv:2, q:'Bacaan ini dibaca saat...', ar:'سُبْحَانَ رَبِّيَ الْأَعْلٰى وَبِحَمْدِهِ', o:['Sujud','Ruku',"I'tidal"]},
  {lv:2, q:'Bacaan ini dibaca saat...', ar:'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ', o:['Ruku','Sujud','Duduk']},
  {lv:2, q:'"Sami\'allaahu liman hamidah" dibaca saat...', o:['Bangun dari ruku','Turun sujud','Salam']},
  {lv:2, q:'Bacaan ini dibaca saat...', ar:'رَبِّ اغْفِرْ لِيْ وَارْحَمْنِيْ وَاجْبُرْنِيْ', o:['Duduk di antara dua sujud','Ruku','Berdiri']},
  {lv:2, q:'Doa iftitah dibaca setelah...', o:['Takbiratul ihram','Ruku','Salam']},
  {lv:2, q:'Shalat yang bacaannya dikeraskan adalah...', o:['Subuh','Dzuhur','Ashar'], ex:'Subuh, Maghrib, dan Isya (rakaat 1–2) dibaca keras. Dzuhur dan Ashar dibaca pelan.'},
  {lv:2, q:'Shalat yang bacaannya dibaca pelan adalah...', o:['Ashar','Maghrib','Subuh']},
  {lv:2, q:'Membasuh tangan saat wudhu sampai ke...', o:['Siku','Pergelangan','Bahu']},
  {lv:2, q:'Membasuh kaki saat wudhu sampai ke...', o:['Mata kaki','Lutut','Jari kaki saja']},
  {lv:2, q:'Yang membatalkan wudhu adalah...', o:['Kentut','Minum air','Tersenyum']},
  {lv:2, q:'Yang membatalkan shalat adalah...', o:['Berbicara dengan sengaja','Membaca surat pendek','Menoleh saat salam']},
  {lv:2, q:'Shalat sunnah di pagi hari setelah matahari naik adalah...', o:['Dhuha','Tahajud','Tarawih']},
  {lv:2, q:'Shalat sunnah di malam bulan Ramadhan adalah...', o:['Tarawih','Dhuha','Idul Adha']},
  {lv:2, q:'Shalat sunnah yang jumlah rakaatnya ganjil adalah...', o:['Witir','Dhuha','Tarawih']},
  {lv:2, q:'Shalat sunnah ketika masuk masjid adalah...', o:['Tahiyatul masjid','Witir','Tahajud']},
  {lv:2, q:'Shalat sunnah qabliyah dikerjakan...', o:['Sebelum shalat wajib','Sesudah shalat wajib','Tengah malam']},
  {lv:2, q:"Shalat sunnah ba'diyah dikerjakan...", o:['Sesudah shalat wajib','Sebelum shalat wajib','Saat matahari terbit']},
  {lv:2, q:'"Ushallii fardhal maghribi tsalaatsa raka\'aatin..." adalah niat shalat...', o:['Maghrib','Subuh','Isya']},
  {lv:2, q:'Dalam niat shalat, "rak\'ataini" artinya...', o:['Dua rakaat','Tiga rakaat','Empat rakaat']},
  {lv:2, q:'Dalam niat shalat, "arba\'a raka\'aatin" artinya...', o:['Empat rakaat','Dua rakaat','Tiga rakaat']},
  {lv:2, q:'Setelah membaca Al-Fatihah kita mengucapkan...', o:['Aamiin','Allaahu akbar','Alhamdulillaah']},
  {lv:2, q:'Shalat Jumat wajib bagi...', o:['Laki-laki muslim yang baligh','Semua anak kecil','Hanya imam masjid']},
  {lv:2, q:'Hewan apa yang disebut dalam surat Al-Fil?', o:['🐘 Gajah','🐫 Unta','🐎 Kuda'], big:true},
  {lv:2, q:'Surat Al-Ikhlas mengajarkan bahwa Allah itu...', o:['Maha Esa','Ada dua','Mempunyai anak']},
  {lv:2, q:'Dzikir setelah shalat: Subhaanallaah dibaca sebanyak...', o:['33 kali','10 kali','100 kali'], ex:'Subhaanallaah 33x, Alhamdulillaah 33x, Allaahu akbar 33x.'},
  {lv:2, q:'Urutkan gerakan shalat ini!', order:['Takbiratul ihram','Ruku',"I'tidal",'Sujud']},
  {lv:2, q:'Urutkan langkah wudhu ini!', order:['Membasuh muka','Membasuh tangan sampai siku','Mengusap kepala','Membasuh kaki']},
  {lv:2, q:'Urutkan shalat wajib dari pagi sampai malam!', order:['Subuh','Dzuhur','Ashar','Maghrib','Isya']},

  // ===== SULIT =====
  {lv:3, q:"Rukun shalat (madzhab Syafi'i, seperti di buku pelajaran) ada berapa?", o:['13','6','17'], num:true, ex:"Biasanya ditulis 13 rukun. Jika tuma'ninah dihitung terpisah, menjadi 17."},
  {lv:3, q:'Fardhu wudhu ada berapa?', o:['6','4','10'], num:true, ex:'Niat, membasuh muka, membasuh tangan sampai siku, mengusap sebagian kepala, membasuh kaki sampai mata kaki, dan tertib.'},
  {lv:3, q:'Manakah yang BUKAN rukun shalat?', o:['Doa iftitah','Membaca Al-Fatihah','Salam pertama'], ex:'Doa iftitah hukumnya sunnah.'},
  {lv:3, q:'Manakah yang termasuk syarat SAH shalat?', o:['Menghadap kiblat','Baligh','Beragama Islam'], ex:'Baligh dan Islam termasuk syarat wajib, bukan syarat sah.'},
  {lv:3, q:'Manakah yang termasuk syarat WAJIB shalat?', o:['Berakal','Menutup aurat','Menghadap kiblat'], ex:'Menutup aurat dan menghadap kiblat termasuk syarat sah.'},
  {lv:3, q:'Manakah yang termasuk SUNNAH wudhu, bukan fardhu?', o:['Berkumur','Membasuh muka','Membasuh kaki']},
  {lv:3, q:'Aurat laki-laki saat shalat adalah antara...', o:['Pusar sampai lutut','Leher sampai kaki','Dada sampai lutut']},
  {lv:3, q:'Aurat perempuan saat shalat adalah seluruh tubuh, kecuali...', o:['Wajah dan telapak tangan','Rambut dan kaki','Tangan sampai siku']},
  {lv:3, q:'Kalau lupa tasyahud awal, sebaiknya melakukan...', o:['Sujud sahwi','Mengulang shalat dari awal','Tidak perlu apa-apa'], ex:'Tasyahud awal termasuk sunnah ab\'adh, jika tertinggal diganti dengan sujud sahwi.'},
  {lv:3, q:"Menurut madzhab Syafi'i, sujud sahwi dilakukan...", o:['Sebelum salam','Sesudah salam','Sebelum takbiratul ihram']},
  {lv:3, q:'Ragu sudah 3 atau 4 rakaat. Yang benar adalah...', o:['Anggap 3, lalu tambah 1 rakaat','Anggap 4, langsung salam','Ulangi dari awal'], ex:'Ambil jumlah yang paling sedikit (yang yakin), lalu sujud sahwi sebelum salam.'},
  {lv:3, q:"Doa qunut (madzhab Syafi'i) dibaca pada...", o:["I'tidal rakaat kedua shalat Subuh",'Sujud terakhir shalat Isya','Setelah salam shalat Maghrib']},
  {lv:3, q:'Shalat Idul Fitri rakaat pertama ada tambahan takbir sebanyak...', o:['7 kali','5 kali','3 kali'], ex:'Rakaat 1: 7 takbir, rakaat 2: 5 takbir.'},
  {lv:3, q:'Shalat Id rakaat kedua ada tambahan takbir sebanyak...', o:['5 kali','7 kali','4 kali']},
  {lv:3, q:'Shalat jenazah terdiri dari berapa takbir?', o:['4','2','7'], num:true},
  {lv:3, q:'Gerakan yang TIDAK ada dalam shalat jenazah adalah...', o:['Ruku dan sujud','Berdiri','Takbir']},
  {lv:3, q:'Hukum shalat jenazah adalah...', o:['Fardhu kifayah','Fardhu ain','Sunnah']},
  {lv:3, q:"Menurut madzhab Syafi'i, gerakan di luar shalat yang membatalkan adalah sebanyak...", o:['3 kali berturut-turut','1 kali','10 kali']},
  {lv:3, q:"Tuma'ninah artinya...", o:['Diam sejenak sampai tenang','Bergerak cepat','Membaca dengan keras']},
  {lv:3, q:'Duduk pada tasyahud akhir disebut duduk...', o:['Tawarruk','Iftirasy','Bersila']},
  {lv:3, q:'Duduk di antara dua sujud disebut duduk...', o:['Iftirasy','Tawarruk','Jongkok']},
  {lv:3, q:'Kata "adaa-an" dalam niat shalat artinya...', o:['Tepat pada waktunya','Mengganti shalat yang tertinggal','Berjamaah']},
  {lv:3, q:'Kalau shalat sebagai makmum, dalam lafaz niat ditambah kata...', o:["Ma'muuman",'Imaaman','Qabliyyatan']},
  {lv:3, q:'Waktu Isya dimulai ketika...', o:['Mega merah di langit barat hilang','Matahari terbenam','Tengah malam']},
  {lv:3, q:'Waktu Dzuhur dimulai ketika...', o:['Matahari tergelincir ke barat','Matahari terbit','Matahari terbenam']},
  {lv:3, q:'Waktu Ashar dimulai ketika...', o:['Bayangan benda sama panjang dengan bendanya','Matahari tepat di atas kepala','Langit mulai gelap']},
  {lv:3, q:'Membaca shalawat Nabi pada tasyahud akhir hukumnya...', o:['Rukun','Sunnah','Makruh']},
  {lv:3, q:'Salam yang termasuk rukun shalat adalah...', o:['Salam pertama (ke kanan)','Salam kedua (ke kiri)','Keduanya sunnah']},
  {lv:3, q:'Rasulullah ﷺ menyuruh anak berlatih shalat sejak umur...', o:['7 tahun','12 tahun','15 tahun'], ex:'HR. Abu Dawud.'},
  {lv:3, q:'Shalat sunnah rawatib muakkad berjumlah...', o:['10 rakaat','17 rakaat','4 rakaat'], ex:"2 qabliyah Subuh, 2 qabliyah Dzuhur, 2 ba'diyah Dzuhur, 2 ba'diyah Maghrib, 2 ba'diyah Isya."},
  {lv:3, q:'Tayamum dilakukan dengan mengusap...', o:['Muka dan kedua tangan sampai siku','Kepala dan kaki','Seluruh badan']},
  {lv:3, q:'Lengkapi niat: "Ushallii fardhazh zhuhri ___ raka\'aatin..."', o:["arba'a","tsalaatsa","rak'ataini"]},
  {lv:3, q:'Lengkapi bacaan: "Asyhadu allaa ilaaha ___"', o:['illallaah','akbar','lillaah']},
  {lv:3, q:'Bacaan ini adalah...', ar:'سُبْحَانَ مَنْ لَا يَنَامُ وَلَا يَسْهُوْ', o:['Bacaan sujud sahwi','Doa iftitah','Bacaan ruku']},
  {lv:3, q:'Urutkan rukun shalat ini!', order:['Takbiratul ihram','Membaca Al-Fatihah','Ruku',"I'tidal",'Sujud']},
  {lv:3, q:'Urutkan dzikir setelah shalat!', order:['Istighfar','Subhaanallaah','Alhamdulillaah','Allaahu akbar']},
  {lv:3, q:'Urutkan bacaan saat berdiri di rakaat pertama!', order:['Takbiratul ihram','Doa iftitah','Al-Fatihah','Surat pendek']},
  {lv:3, q:'Urutkan bacaan di akhir shalat!', order:['Tasyahud','Shalawat Ibrahimiyah','Doa sebelum salam','Salam']},
];

// ---------- lencana ----------
export const BADGES = [
  {k:'wudhu', ic:'💧', t:'Si Bersih', d:'Menyelesaikan langkah wudhu'},
  {k:'gerakan', ic:'🧎', t:'Ahli Gerakan', d:'Melihat semua gerakan shalat'},
  {k:'praktik', ic:'🕌', t:'Praktik Pertama', d:'Menyelesaikan praktik shalat'},
  {k:'praktik5', ic:'🌟', t:'Lima Waktu', d:'Praktik Subuh, Dzuhur, Ashar, Maghrib, dan Isya'},
  {k:'kuis1', ic:'🥉', t:'Juara Mudah', d:'Dapat 3 bintang di kuis Mudah'},
  {k:'kuis2', ic:'🥈', t:'Juara Sedang', d:'Dapat 3 bintang di kuis Sedang'},
  {k:'kuis3', ic:'🥇', t:'Juara Sulit', d:'Dapat 3 bintang di kuis Sulit'},
  {k:'kilat', ic:'⚡', t:'Si Kilat', d:'Menjawab 15 soal benar di Tantangan Kilat'},
  {k:'lengkap', ic:'✅', t:'Shalat Lengkap', d:'Mencentang 5 shalat dalam sehari'},
  {k:'streak3', ic:'🔥', t:'Semangat 3 Hari', d:'Shalat lengkap 3 hari berturut-turut'},
  {k:'streak7', ic:'🏆', t:'Istiqamah 7 Hari', d:'Shalat lengkap 7 hari berturut-turut'},
  {k:'tasbih', ic:'📿', t:'Ahli Dzikir', d:'Menyelesaikan tasbih 33-33-33'},
  {k:'doa', ic:'🤲', t:'Rajin Berdoa', d:'Membuka 10 doa harian'},
  {k:'bintang50', ic:'⭐', t:'50 Bintang', d:'Mengumpulkan 50 bintang'},
  {k:'bintang150', ic:'🌠', t:'150 Bintang', d:'Mengumpulkan 150 bintang'},
  {k:'bintang300', ic:'👑', t:'300 Bintang', d:'Mengumpulkan 300 bintang'},
];

// Id rekaman suara untuk soal kuis. Soal dengan kalimat yang sama memakai satu rekaman.
export function quizKey(q) {
  let h = 5381;
  for (const ch of q.q + '|' + (q.ar || '')) h = (h * 33 + ch.codePointAt(0)) >>> 0;
  return 'kuis_' + h.toString(36);
}
