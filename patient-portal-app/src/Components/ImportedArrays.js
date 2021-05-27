const diagnosisArray = [
    "Acute Lymphoblastic Leukemia (ALL)",
    "Acute Lymphoblastic Leukemia (ALL) - B-cell",
    "Acute Lymphoblastic Leukemia (ALL) - Mixed ALL/NHL",
    "Acute Lymphoblastic Leukemia (ALL) - Myelodysplastic Syndrome (MDS)",
    "Acute Lymphoblastic Leukemia (ALL) - T-Cell",
    "Acute Myelogenous Leukemia (AML)",
    "Acute Myelogenous Leukemia (AML) - Acute Promyelocytic Leukemia M-3",
    "Acute Myelogenous Leukemia (AML) - AML-1",
    "Acute Myelogenous Leukemia (AML) - AML-2",
    "Acute Myelogenous Leukemia (AML) - AML-4",
    "Acute Myelogenous Leukemia (AML) - AML-5",
    "Acute Myelogenous Leukemia (AML) - AML-6",
    "Acute Myelogenous Leukemia (AML) - AML-7",
    "Acute Myelogenous Leukemia (AML) - Myelodysplastic Syndrome (MDS)",
    "Adenocarcinoma",
    "Adrenocortical Carcinoma",
    "Aggressive NK-cell Leukemia",
    "Biphenotypic Acute Leukemia",
    "Bone Tumor",
    "Bone Tumor - Chordoma",
    "Bone Tumor - Fibrosarcoma",
    "Bone Tumor - Hemangioendothelioma",
    "Bone Tumor - Osteosarcoma",
    "Brain Tumor and Spinal Cord Tumor",
    "Brain Tumor and Spinal Cord Tumor - Astrocytoma",
    "Brain Tumor and Spinal Cord Tumor - Astroglioma",
    "Brain Tumor and Spinal Cord Tumor - Atypical Teratoid Rhabdoid Tumor (AT/RT)",
    "Brain Tumor and Spinal Cord Tumor - Brainstem Glioma",
    "Brain Tumor and Spinal Cord Tumor - Chiasmatic Glioma",
    "Brain Tumor and Spinal Cord Tumor - Choroid Plexus Carcinoma",
    "Brain Tumor and Spinal Cord Tumor - Craniopharyngioma",
    "Brain Tumor and Spinal Cord Tumor - Diffuse Intrinsic Pontine Glioma (DIPG)",
    "Brain Tumor and Spinal Cord Tumor - Ependymoma",
    "Brain Tumor and Spinal Cord Tumor - Fibrillary Astrocytoma",
    "Brain Tumor and Spinal Cord Tumor - Ganglioglioma",
    "Brain Tumor and Spinal Cord Tumor - Germinoma",
    "Brain Tumor and Spinal Cord Tumor - Germinoma Teratoma",
    "Brain Tumor and Spinal Cord Tumor - Glioblastoma Multiforme (GBM)",
    "Brain Tumor and Spinal Cord Tumor - Gliomatosis Cerebri",
    "Brain Tumor and Spinal Cord Tumor - Hypophyseal Duct Tumor",
    "Brain Tumor and Spinal Cord Tumor - Infantile Hemangioma",
    "Brain Tumor and Spinal Cord Tumor - Juvenile Pilocytic Astrocytoma (JPA)",
    "Brain Tumor and Spinal Cord Tumor - Leptomeningeal Glioma",
    "Brain Tumor and Spinal Cord Tumor - Medulloblastoma",
    "Brain Tumor and Spinal Cord Tumor - Meningioma",
    "Brain Tumor and Spinal Cord Tumor - Mixed Glioneuronal",
    "Brain Tumor and Spinal Cord Tumor - Neurocytoma",
    "Brain Tumor and Spinal Cord Tumor - Nongerminomatous Germ Cell Tumor",
    "Brain Tumor and Spinal Cord Tumor - Oligodendroglioma",
    "Brain Tumor and Spinal Cord Tumor - Papillary Tumor of the Pineal Region",
    "Brain Tumor and Spinal Cord Tumor - Pilocytic Astrocytoma",
    "Brain Tumor and Spinal Cord Tumor - Pilomyxoid Astrocytoma (PMA)",
    "Brain Tumor and Spinal Cord Tumor - Pineal Germinoma",
    "Brain Tumor and Spinal Cord Tumor - Pinealoblastoma",
    "Brain Tumor and Spinal Cord Tumor - Pituitary Adenoma",
    "Brain Tumor and Spinal Cord Tumor - Pontine Glioma",
    "Brain Tumor and Spinal Cord Tumor - Posterior Fossa Tumor",
    "Brain Tumor and Spinal Cord Tumor - Prechiasmatic Hypothalamus",
    "Brain Tumor and Spinal Cord Tumor - Primitive Neuroectodermal Tumors (PNET)",
    "Brain Tumor and Spinal Cord Tumor - Tectal Glioma",
    "Brain Tumor and Spinal Cord Tumor - Visual Pathway Hypothalamic Glioma",
    "Breast Cancer",
    "Chronic Myelogenous Leukemia (CML)",
    "Chronic Myelogenous Leukemia (CML)- Myelodysplastic Syndrome (MDS)",
    "Chronic Myelomonocytic Leukemia (CMML)",
    "Chronic Myelomonocytic Leukemia (CMML) - Myelodsyplastic Syndrome (MDS)",
    "Ewing’s Sarcoma",
    "Ewing’s Sarcoma - Askin’s Tumor",
    "Ewing’s Sarcoma - Ewing’s tumor of Bone",
    "Ewing’s Sarcoma - Extraosseous Ewing’s",
    "Ewing’s Sarcoma - Primitive Neuroectodermal Tumor (PNET)",
    "Ewing’s Sarcoma - Dysgerminoma",
    "Ewing’s Sarcoma - Embryonal Cell Carcinoma",
    "Ewing’s Sarcoma - Sacrococcygeal",
    "Germ Cell Tumor",
    "Hepatoblastoma",
    "Hepatoblastoma - Hepatocellular Carcinoma",
    "Hepatoblastoma - Infantile Choriocarcinoma",
    "Hepatoblastoma - Undifferentiated Embryonal Sarcoma of the Liver (UESL)",
    "Hodgkin’s Lymphoma",
    "Juvenile Myelomonocytic Leukemia (JMML)",
    "Kidney Cancer",
    "Kidney Cancer - II Sarcoma of the Kidney (CCSK)",
    "Kidney Cancer - Renal Carcinoma",
    "Kidney Cancer - Rhabdoid Tumor of the Kidney",
    "Kidney Cancer - Wilm’s Tumor",
    "Lung Tumor",
    "Lung Tumor- Pleuropulmonary Blastoma",
    "Malignant Peripheral Nerve Sheath Tumor (MPNST)",
    "Malignant Rhabdoid Tumor (MRT)",
    "Myelodysplastic Syndrome/Pre-leukemia (MDS)",
    "Neuroblastoma",
    "Non-Hodgkin’s Lyphoma (NHL)",
    "Other Tumors",
    "Other Tumors - Acinic Cell Carcinoma",
    "Other Tumors - Angiomatoid Malignant Fibrous Histiocytoma",
    "Other Tumors - Eccrine Carcanoma",
    "Other Tumors - Ganglioneuroma",
    "Other Tumors - Gastric Tumor",
    "Other Tumors - Invasive Thymoma",
    "Other Tumors - Melanotic Neuroectodermal Tumor",
    "Other Tumors - Mesoblastic Nephroma",
    "Other Tumors - Mucoepidermoid Carcinoma of the Parotid",
    "Other Tumors - Nasopharyngeal Carcinoma",
    "Other Tumors - Neuroendocrine Tumor",
    "Other Tumors - Paraganglioma",
    "Ovarian Cancer",
    "Ovarian Cancer - Dsygerminoma",
    "Ovarian Cancer - Germ Cell",
    "Ovarian Cancer - Small Cell",
    "Ovarian Cancer - Yolk Sac Tumor",
    "Pancreatic Cancer",
    "Pancreatic Cancer - Acinar Cell Carcinoma",
    "Pancreatic Cancer - Insulinoma",
    "Pancreatic Cancer - Pancreatoblastoma",
    "Retinoblastoma",
    "Retinoblastoma - Hereditary",
    "Retinoblastoma - Non hereditary",
    "Rhabdomyosarcoma",
    "Sarcoma",
    "Sarcoma - Askin’s Tumor",
    "Sarcoma - Chondrosarcoma",
    "Sarcoma - Dermtofibrosarcoma Protuberans",
    "Sarcoma - Malignant Hemangioendothelioma",
    "Sarcoma - Malignant Schwannoma",
    "Skin Cancer",
    "Skin Cancer - Basal Cell",
    "Skin Cancer - Melanoma",
    "Skin Cancer - Squamous",
    "Soft Tissue Sarcoma",
    "Soft Tissue Sarcoma - Desmoplastic Small Round Tumor (DSRCT)",
    "Soft Tissue Sarcoma - Epithelioid",
    "Soft Tissue Sarcoma - Hemangiopericytoma",
    "Soft Tissue Sarcoma - Infantile Fibrosarcoma",
    "Soft Tissue Sarcoma - Leiomyosarcoma",
    "Soft Tissue Sarcoma - Liposarcoma",
    "Soft Tissue Sarcoma - Mesenchymal Chondrosarcoma",
    "Soft Tissue Sarcoma - Synovial Sarcoma",
    "Soft Tissue Sarcoma - Undifferentiated Embryonal Sarcoma",
    "Testicular Cancer",
    "Testicular Cancer - Paratesticular Rhabdomyosarcoma",
    "Testicular Cancer - Yolk Sac Tumor",
    "Thyroid Cancer",
    "Thyroid Cancer - Anaplastic Thyroid",
    "Thyroid Cancer - Follicular Thyroid",
    "Thyroid Cancer - Medullary Thyroid Papillary Thyroid Carcinoma",
  ];
  
  const hospitalArr = [
    "Advocate Hope Children's Hospital Oak Lawn Illinois",
    "Advocate Lutheran Children's Hospital Park Ridge Illinois",
    "Akron Children's Hospital Akron Ohio",
    "Alex’s Place Sylvester University of Miami Miami Florida",
    "American Family Children's Hospital Madison Wisconsin",
    "AnMed Health Women's and Children's Hospital Anderson South Carolina",
    "Ann and Robert H. Lurie Children's Hospital of Chicago Chicago Illinois",
    "Arkansas Children's Hospital Little Rock Arkansas",
    "Arnold Palmer Hospital for Children Orlando FLorida",
    "Banner University Medical Center Tucson",
    "Barbara Bush Children's Hospital Portland Maine",
    "Bayamon Children's Hospital Bayamón Puerto Rico",
    "Baystate Children's Hospital Springfield Massachusetts",
    "Beacon Children's Hospital South Bend Indiana",
    "Blair E. Batson Hospital for Children at the University of Mississippi Medical Center Jackson Mississippi",
    "Blank Children's Hospital Des Moines Iowa",
    "Blythedale Children's Hospital Valhalla New York",
    "Boston Children's Hospital Boston Massachusetts",
    "Bradley Hospital (Children's Psychiatric East Providence Rhode Island) Rhode Island",
    "Brenner Children's Hospital at Wake Forest Baptist Medical Center Winston-Salem North Carolina",
    "Bristol Myers Squibb Children's Hospital at Robert Wood Johnson University Hospital New Brunswick New Jersey",
    "Bronson Methodist Children's Health Kalamazoo Michigan",
    "C.S. Mott Children's Hospital Ann Arbor Michigan",
    "California Children's Hospital Association California",
    "CAMC Women and Children's Hospital Charleston West Virginia",
    "Cardinal Glennon Children's Hospital St. LouisMissouri",
    "Cardon Children's Medical Center Mesa Arizona",
    "Carilion Clinic Children's Hospital RoanokeVirginia",
    "Children's Center at Sutter Medical Center Sacramento California",
    "Children's Healthcare of Atlanta at Henrietta Egleston Hospital for Children Georgia",
    "Children's Healthcare of Atlanta at Hughes Spalding Children's Hospital Georgia",
    "Children's Healthcare of Atlanta at Scottish Rite Children's Hospital Georgia",
    "Children's Healthcare of Atlanta Atlanta Georgia",
    "Children's Hospital at Dartmouth (CHaD) Lebanon Manchester Nashua Dover New Hampshire",
    "Children's Hospital at Montefiore The Bronx New York",
    "Children's Hospital Colorado Aurora Colorado",
    "Children's Hospital Los Angeles Los Angeles California",
    "Children's Hospital Oakland Oakland California",
    "Children's Hospital of Georgia Augusta Geogria",
    "Children's Hospital of Michigan Detroit Michigan",
    "Children's Hospital of Michigan Troy Michigan",
    "Children's Hospital of Nevada Las Vegas Nevada",
    "Children's Hospital of New Jersey at Newark Beth Israel Medical Center Newark New Jersey",
    "Children's Hospital of New Orleans New Orleans Louisiana",
    "Children's Hospital of Orange County Mission Viejo and Orange California",
    "Children's Hospital of Philadelphia Philadelphia Pennsylvania",
    "Children's Hospital of San Antonio CHRISTUS Santa Rosa Health System San Antonio Texas",
    "Children's Hospital of The King's Daughters Norfolk Virginia",
    "Children's Hospital of Wisconsin Wauwatosa (suburb of Milwaukee) Wisconsin",
    "Children's Hospital of Wisconsin-Fox Valley Neenah Wisconsin",
    "Children's Hospital Omaha Nebraska",
    "Children's Hospital Richmond Virginia",
    "Children's Hospitals and Clinics of Minnesota Minneapolis Minnesota",
    "Children's Hospitals and Clinics St. Paul Minnesota",
    "Children's Medical Center Dallas Dallas Texas",
    "Children's Memorial Hermann Hospital Houston Texas",
    "Children's Mercy Hospital Kansas Overland Park Kanasas",
    "Children's Mercy Hospital Kansas City Missouri",
    "Children's National Medical Center Washington D.C. District of Columbia",
    "Children's of Alabama Birmingham Alabama",
    "Children's Specialized Hospital Mountainside New Jersey",
    "Cincinnati Children's Hospital Medical Center Cincinnati Ohio",
    "Cleveland Clinic Children's Hospital Rehabilitation Center Cleveland Ohio",
    "Connecticut Children's Medical Center Hartford Connecticut",
    "Cook Children's Healthcare System Fort WorthTexas",
    "Covenant Children's Hospital Lubbock Texas",
    "Dayton Children's Hospital Dayton Ohio",
    "Dell Children's Medical Center of Central Texas Austin Texas",
    "Doernbecher Children's Hospital Portland Oregon",
    "Driscoll Children's Hospital Corpus Christi Texas",
    "Duke Children's Hospital Durham North Carolina",
    "Dwaine & Cynthia Willett Children’s Hospital of Savannah at Memorial Health Savannah Georgia",
    "East Tennessee Children's Hospital Knoxville Tennessee",
    "Edinburg Children's Hospital Edinburg Texas",
    "El Paso Children's Hospital El Paso Texas",
    "Floating Hospital for Children Boston Massachusetts",
    "Florida Hospital for Children Orlando FLorida",
    "Franciscan Hospital for Children Boston Massachusetts",
    "Gillette Children's Specialty Healthcare St. Paul Minnesota",
    "Golisano Children's Hospital at University of Rochester Strong Memorial Hospital Rochester New York",
    "Golisano Children's Hospital of Southwest Florida Lee Memorial Health System Fort Myers Florida",
    "Golisano Children's Hospital State University of New York Upstate Medical University Syracuse New York",
    "Goryeb Children's Hospital at Morristown Medical Center New Jersey",
    "Greenville South Carolina Children's Hospital Greenville South Carolina",
    "Hasbro Children's Hospital Providence Rhode Island",
    "Hassenfeld Children's Hospital of New York at NYU Manhattan New York",
    "Helen DeVos Children's Hospital Grand Rapids Michigan",
    "Hemby Children's Hospital at Novant Health Presbyterian Medical Center Charlotte North Carolina",
    "Holtz Children's Hospital Miami Florida",
    "Huntsville Hospital for Women and Children Huntsville Alabama",
    "Hurley Children's Hospital Flint Michigan",
    "INOVA Children's Hospital Falls Church Virginia",
    "James and Connie Maynard Children’s Hospital",
    "Janet Weis Children's Hospital Danville Pennsylvania",
    "Jeff Gordon's Children's Hospital at Carolinas HealthCare System NorthEast Concord North Carolina",
    "Joe DiMaggio Children’s Hospital Hollywood Florida",
    "John R. Oishei Children's Hospital Buffalo New York",
    "John Sealy Childrens Hospital Galveston Texas",
    "Johns Hopkins All Children's Hospital Inc. St. Petersburg Florida",
    "Johns Hopkins Children's Center Baltimore Maryland",
    "K. Hovnanian Children's Hospital at Jersey Shore University Medical Center Neptune City New Jersey",
    "Kapi'olani Medical Center for Women & Children Honolulu Hawaii",
    "Kennedy Krieger Institute Baltimore Maryland",
    "Komansky Center for Children's Health of New York-Presbyterian Manhattan New York",
    "Kravis Children’s Hospital at Mount Sinai Manhattan New York",
    "La Rabida Children's Hospital Chicago Illinois",
    "Lauren Small Children's Center at Bakersfield Memorial Hospital Bakersfield California",
    "Le Bonheur Children's Medical Center Inc. Memphis Tennessee",
    "Levine Children's Hospital Charlotte North Carolina",
    "Loma Linda University Children's Hospital Loma Linda California",
    "Lucile Packard Children's Hospital at Stanford Palo Alto California",
    "Maria Fareri Children's Hospital at Westchester Medical Center Valhalla New York",
    "Mary Bridge Children's Hospital Tacoma Washington",
    "MassGeneral Hospital for Children Boston Massachusetts",
    "Mattel Children's Hospital UCLA Los Angeles California",
    "Maynard Children's Hospital at Vidant Medical Center Greenville North Carolina",
    "Mayo Clinic – Eugenio Litta Children's Hospital Rochester Minnesota",
    "MD Anderson Cancer Center Houston Texas",
    "Medical City Chidren's Hospital Dallas Texas",
    "Medical University of South Carolina Children's Hospital Charleston South Carolina",
    "Memorial Hospital for Children Colorado Springs Colorado",
    "Mercy Children's Hospital St. Louis and Springfield Missouri",
    "Mercy Children's Hospital Toledo Ohio",
    "Methodist Children's Hospital San Antonio Texas",
    "Miami Cancer Institute Miami Florida",
    "Miller Children's Hospital Long Beach California",
    "Monroe Carell Jr. Children's Hospital at Vanderbilt Nashville Tennessee",
    "Morgan Stanley Children's Hospital of New York-Presbyterian Manhattan New York",
    "Mt. Washington Pediatric Hospital Baltimore Maryland",
    "Nationwide Children's Hospital Columbus Ohio",
    "Nemours Alfred I. duPont Hospital for Children Wilmington Delaware",
    "Nemours Children's Hospital Orlando Florida",
    "Nicklaus Children's Hospital Miami Florida",
    "Niswonger Children's Hospital Johnson City Tennessee",
    "North Shore Children's Hospital Salem Massachusetts",
    "Norton Children's Hospital Louisville Kentucky",
    "Our Lady of the Lake Children's Hospital Baton Rouge Louisiana",
    "Palm Beach Children's Hospital at St. Mary's Medical Center West Palm Beach Florida",
    "Palmetto Health Children's Hospital Columbia (Palmetto Health Richland Campus) South Carolina",
    "Penn State Children's Hospital Hershey Pennsylvania",
    "Peyton Manning Children's Hospital at St. Vincent's Indianapolis Indiana",
    "Phoebe Putney Memorial Hospital Albany Georgia",
    "Phoenix Children's Hospital Phoenix Arazona ",
    "Primary Children's Hospital Salt Lake City Utah",
    "Providence Memorial Children's Hospital El Paso Texas",
    "Rady Children's Hospital San Diego California",
    "Rainbow Babies & Children's Hospital Cleveland Ohio",
    "Randall Children's Hospital at Legacy Emanuel Portland Oregon",
    "Ranken Jordan Pediatric Bridge Hospital Maryland HeightsMissouri",
    "Renown Children's Hospital Reno Nevada",
    "Riley Hospital for Children at Indiana University Health Indianapolis Indiana",
    "Rocky Mountain Hospital for Children Denver Colorado",
    "Rush University Children's Hospital Chicago Illinois",
    "Sacred Heart Children's Hospital Spokane Washington",
    "Saint Joseph's Children's Hospital Marshfield Wisconsin",
    "Saint Mary's Children's Hospital Richmond Virginia",
    "Salah Foundation Children’s Hospital at Broward Health Fort Lauderdale Florida",
    "San Jorge Children's Hospital San Juan Puerto Rico",
    "Sanford Health Children's Hospital Sioux Falls South Dakota",
    "Sanzari Children's Hospital at Hackensack University Medical Center New Jersey",
    "Scott & White Memorial Hospital Children's Hospital Temple Texas",
    "Seattle Children's Hospital Seattle Washington",
    "Shriners Hospital for Children Boston (burn care) Massachusetts",
    "Shriners Hospital for Children Cincinnati (acute burns cleft lip and palate pediatric plastic surgery) Ohio",
    "Shriners Hospital for Children Erie (orthopaedics) Pennsylvania",
    "Shriners Hospital for Children Galveston (burn care) Texas",
    "Shriners Hospital for Children Honolulu (orthopaedics) Hawaii",
    "Shriners Hospital for Children Houston (orthopaedics) Texas",
    "Shriners Hospital for Children Lexington (orthopedics) Kentucky",
    "Shriners Hospital for Children Los Angeles California",
    "Shriners Hospital for Children Philadelphia (orthopaedics spinal cord injury) Pennsylvania",
    "Shriners Hospital for Children Portland (orthopaedics) Oregon",
    "Shriners Hospital for Children Sacramento California",
    "Shriners Hospital for Children Salt Lake City (orthopaedics) Utah",
    "Shriners Hospital for Children Shreveport (orthopaedics cleft lip and palate) Louisiana",
    "Shriners Hospital for Children Spokane (orthopaedics) Washington",
    "Shriners Hospital for Children Springfield (orthopaedics cleft lip and palate) Massachusetts",
    "Shriners Hospital for Children Tampa (orthopedics) Florida",
    "Shriners Hospitals for Children - Twin Cities Minneapolis Minnesota",
    "Shriners Hospitals for Children Chicago (orthopaedics spinal cord injury cleft lip and palate) Illinois",
    "Shriners Hospitals for Children Greenville South Carolina",
    "Shriners Hospitals for Children St. Louis Missouri",
    "St Jude Children's Research Hospital (Little Rock) Alaska",
    "St. Christopher's Hospital for Children Philadelphia Pennsylvania",
    "St. John's Children's Hospital Springfield Illinois",
    "St. Joseph's Children's Hospital of Tampa Tampa Florida",
    "St. Joseph's Children's Hospital Paterson New Jersey",
    "St. Jude Children's Research Hospital Memphis Tennessee",
    "St. Louis Children's Hospital St. Louis Missouri",
    "St. Luke's Children's Hospital Boise Idaho",
    "St. Mary's Hospital for Children Bayside Queens New York",
    "Steven and Alexandra Cohen Children's Medical Center of New York New Hyde Park New York",
    "Stony Brook Children's at Stony Brook University Hospital Stony Brook New York",
    "Sunrise Children's Hospital Las Vegas Nevada",
    "T.C. Thompson Children's Hospital Chattanooga Tennessee",
    "Texas Children's Hospital Houston Texas",
    "Texas Scottish Rite Hospital for Children Dallas Texas",
    "The Children’s Hospital at Saint Peter's University Hospital New Brunswick New Jersey",
    "The Children's Hospital at Providence Anchorage Alaska",
    "The Children's Hospital at Saint Francis Tulsa Oklahoma",
    "The Children's Hospital at The Medical Center of Central Georgia Macon Georgia",
    "The Children's Hospital of Illinois at OSF Saint Francis Medical Center Peoria Illinois",
    "The Children's Hospital of Oklahoma Oklahoma City Oklahoma",
    "The Children's Institute Pittsburgh Pennsylvania",
    "The Herman & Walter Samuelson Children's Hospital at Sinai BaltimoreMaryland",
    "The Studer Family Children's Hospital at Sacred Heart Pensacola Florida",
    "The University of Chicago Comer Children's Hospital Chicago Illinois",
    "The Unterberg Children Hospital at Monmouth Medical Center Drexel University New Jersey",
    "Toledo Children's Hospital Toledo Ohio",
    "Transitional Infant Care (NICU Hospital) Pittsburgh Pennsylvania",
    "UC Davis Medical Center Sacramento California",
    "UC Irvine Medical Center Irvine California",
    "UCSF Benioff Children's Hospital San Francisco California",
    "UF Health Shands Children's Hospital Gainesville Florida",
    "UNC Children's Hospital Chapel Hill North Carolina",
    "University Hospital Pediatrics Newark New Jersey",
    "University of Iowa Children's Hospital Iowa City Iowa",
    "University of Kentucky Children's Hospital Lexington Kentucky",
    "University of Minnesota Children's Hospital Minneapolis Minnesota",
    "University of Missouri Women's and Children's Hospital Columbia Missouri",
    "University of Vermont Children's Hospital Burlington Vermont",
    "University of Virginia Children's Hospital Charlottesville Virginia",
    "University Pediatric Hospital (Medical Science Campus) San Juan Puerto Rico",
    "UPMC Children's Hospital of Pittsburgh Pennsylvania",
    "USA Children's and Women's Hospital Mobile Alabama",
    "Valley Children's Hospital Madera California",
    "West Virginia University Children's Hospital Morgantown West Virginia",
    "Wolfson Children's Hospital Jacksonville Florida",
    "Yale-New Haven Children's Hospital New Haven Connecticut",
  ];

  export {hospitalArr, diagnosisArray};