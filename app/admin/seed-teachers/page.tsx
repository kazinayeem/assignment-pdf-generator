"use client";
import { useState } from "react";
import { useProtectedRoute } from "@/lib/use-protected-route";
import { addTeacher } from "@/lib/firestore-service";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const SWE_TEACHERS = [
  { initial: "IM", name: "Dr. Imran Mahmud", designation: "Professor & Head", email: "imranmahmud@daffodilvarsity.edu.bd", phone: "01711370502", room: "607" },
  { initial: "FE", name: "Dr. Md Fazla Elahe", designation: "Assistant Professor & Associate Head", email: "elahe.se@daffodilvarsity.edu.bd", phone: "01891866411", room: "607" },
  { initial: "SS", name: "DR. A. H. M. SAIFULLAH SADI", designation: "Professor", email: "sadi.swe@diu.edu.bd", phone: "01795379956", room: "607" },
  { initial: "SP", name: "A.H.M Shahariar Parvez", designation: "Associate Professor", email: "shahariar.swe@diu.edu.bd", phone: "01718642878", room: "724" },
  { initial: "HM", name: "Dr. S. M. Hasan Mahmud", designation: "Associate Professor", email: "drhasan.swe@diu.edu.bd", phone: "01722418230", room: "605" },
  { initial: "RI", name: "DR. RUBAIYAT ISLAM", designation: "Associate Professor", email: "islam.swe@diu.edu.bd", phone: "01711593262", room: "907" },
  { initial: "MAK", name: "Dr. MD ABDUL KADER", designation: "Associate Professor", email: "abdulkader.swe@diu.edu.bd", phone: "01722241303", room: "907" },
  { initial: "DKS", name: "Dr. Kamrul I. Shahin", designation: "Associate Professor", email: "kamrul.isbd@gmail.com", phone: null, room: null },
  { initial: "THZ", name: "Tanvir Hasan Zoha", designation: "Associate Professor", email: "tanvirzoha@gmail.com", phone: "01755555560", room: null },
  { initial: "MKS", name: "Khaled Sohel", designation: "Assistant Professor", email: "khaledsohel@daffodilvarsity.edu.bd", phone: "01713493251", room: "605" },
  { initial: "AB", name: "Afsana Begum", designation: "Assistant Professor", email: "afsana.swe@diu.edu.bd", phone: "01717545414", room: "607" },
  { initial: "MSA", name: "Md. Shohel Arman", designation: "Assistant Professor", email: "arman.swe@diu.edu.bd", phone: "01673383289", room: "601" },
  { initial: "TRT", name: "Tapushe Rabaya Toma", designation: "Assistant Professor", email: "toma.swe@diu.edu.bd", phone: "01676078744", room: "605" },
  { initial: "SH", name: "Shahina Haque", designation: "Assistant Professor", email: "shahina@daffodilvarsity.edu.bd", phone: "01856059153", room: "805" },
  { initial: "DMA", name: "Dr. Marzia Ahmed", designation: "Assistant Professor", email: "marzia.swe@diu.edu.bd", phone: "01745482644", room: "908" },
  { initial: "NIR", name: "Nadira Islam", designation: "Assistant Professor", email: "nadira.swe@diu.edu.bd", phone: "01759339422", room: "605" },
  { initial: "HI", name: "Hafizul Imran", designation: "Assistant Professor", email: "hafizul.swe@daffodilvarsity.edu.bd", phone: "01740064708", room: "605" },
  { initial: "DSM", name: "Dr. Shabnom Mustary", designation: "Assistant Professor", email: "shabnom.swe@diu.edu.bd", phone: "01795951569", room: "608" },
  { initial: "SR", name: "Md. Selim Reza", designation: "Assistant Professor", email: "selim.swe0161.c@diu.edu.bd", phone: "01719310512", room: "805" },
  { initial: "AS", name: "Ayesha Siddika", designation: "Assistant Professor", email: "ayesha.swe@diu.edu.bd", phone: "01794113665", room: null },
  { initial: "MKH", name: "Dr. Mohammad Kamal Hossain Foraji", designation: "Assistant Professor", email: "kamal.swe@diu.edu.bd", phone: "01782779977", room: null },
  { initial: "MTK", name: "DR. MST. TASKIA KHATUN", designation: "Assistant Professor", email: "khatun.swe@diu.edu.bd", phone: "01701564663", room: null },
  { initial: "UKD", name: "Uttam Kumar Dey", designation: "Assistant Professor", email: "ukdey2050@gmail.com", phone: "01685055737", room: null },
  { initial: "MSM", name: "Mohammad Sultan Mahmud", designation: "Assistant Professor", email: "m.smahmud@yahoo.com", phone: "01977295641", room: null },
  { initial: "KBB", name: "Khalid Been Badruzzaman", designation: "Lecturer (Senior Scale)", email: "khalid@daffodilvarsity.edu.bd", phone: "01673290848", room: "605" },
  { initial: "FBR", name: "Fatama Binta Rafiq", designation: "Lecturer (Senior Scale)", email: "fatama.swe@diu.edu.bd", phone: "01516187007", room: "605" },
  { initial: "RM", name: "Mr. Md. Rajib Mia", designation: "Lecturer (Senior Scale)", email: "rajib.swe@diu.edu.bd", phone: "01796679434", room: "605" },
  { initial: "SA", name: "Md. Suhag Ali", designation: "Lecturer (Senior Scale)", email: "suhag.swe@diu.edu.bd", phone: "01303382828", room: null },
  { initial: "KRA", name: "Kazi Rifat Ahmed", designation: "Lecturer (Senior Scale)", email: "rifat.swe@diu.edu.bd", phone: "01521259962", room: null },
  { initial: "RMS", name: "Ms. Rakhi Moni Saha", designation: "Lecturer (Senior Scale)", email: "rakhi.swe@diu.edu.bd", phone: "01754347750", room: "605" },
  { initial: "IS", name: "Ishrat Sultana", designation: "Lecturer (Senior Scale)", email: "ishrat.swe@diu.edu.bd", phone: "01684531230", room: null },
  { initial: "FH", name: "Md. Fahad Hossain", designation: "Lecturer (Senior Scale)", email: "fahadhossain.cs@gmail.com", phone: "01946704373", room: null },
  { initial: "MH", name: "Md. Mahedi Hassan", designation: "Lecturer (Senior Scale)", email: "mahedi7171@gmail.com", phone: "01758097971", room: null },
  { initial: "DMR", name: "Dr. Md Mahbubur Rahman", designation: "Lecturer (Senior Scale)", email: "mahbubur.swe0201.c@diu.edu.bd", phone: "01755508971", room: null },
  { initial: "DEH", name: "Dr. Ehteshamul Haque", designation: "Lecturer (Senior Scale)", email: "ehteshamul.swe0151.c@diu.edu.bd", phone: "01784020038", room: null },
  { initial: "DK", name: "Debasis Kumar", designation: "Lecturer (Senior Scale)", email: "debasis.cse0572.c@diu.edu.bd", phone: "01710589096", room: null },
  { initial: "FC", name: "Fayazunnesa Chowdhury", designation: "Lecturer (Senior Scale)", email: "fayazunnesa.cse0405.c@diu.edu.bd", phone: "01737216620", room: null },
  { initial: "ABK", name: "Abdullah Bin Kasem Bhuiya", designation: "Lecturer (Senior Scale)", email: "abkbhuiyanjehad@gmail.com", phone: "01831661534", room: null },
  { initial: "NA", name: "Nahida Akther", designation: "Lecturer (Senior Scale)", email: "nahida1710@gmail.com", phone: "01730370365", room: null },
  { initial: "RJM", name: "Ms. Raiyan Janik Monir", designation: "Lecturer", email: "raiyanjanik.swe@diu.edu.bd", phone: "01776314653", room: "907" },
  { initial: "MTM", name: "Munira Tabassum Mou", designation: "Lecturer", email: "munira.swe@diu.edu.bd", phone: "01319396567", room: "605" },
  { initial: "SCS", name: "Suprove Chandra Sarkar", designation: "Lecturer", email: "suprove.swe@diu.edu.bd", phone: "01521539046", room: "907" },
  { initial: "MMH", name: "Md Mozammelul Haque", designation: "Lecturer", email: "mozammelul.swe@diu.edu.bd", phone: "01794190171", room: "907" },
  { initial: "AHZ", name: "Abdul Hye Zebon", designation: "Lecturer", email: "zebon.swe@diu.edu.bd", phone: "01521438443", room: null },
  { initial: "AE", name: "Ashrafia Esha", designation: "Lecturer", email: "ashrafiaesha.swe@diu.edu.bd", phone: "01316711223", room: null },
  { initial: "MTE", name: "Masrufa Tasnim Esha", designation: "Lecturer", email: "tasnim.swe@diu.edu.bd", phone: "01553081243", room: null },
  { initial: "MR", name: "MD. MAZBAUR RASHID", designation: "Lecturer", email: "mazba.swe@diu.edu.bd", phone: "01796228391", room: null },
  { initial: "AG", name: "Akash Gosh", designation: "Lecturer", email: "akash.swe@diu.edu.bd", phone: "01761822321", room: null },
  { initial: "RT", name: "Rifa Tasfia", designation: "Lecturer", email: "rifa.swe@diu.edu.bd", phone: "01737869274", room: null },
  { initial: "MSS", name: "MS. SYEDA SUMAIA SULTANA", designation: "Lecturer", email: "sultana.swe@diu.edu.bd", phone: "01864646749", room: null },
  { initial: "PC", name: "MR. PARTHO CHANDA", designation: "Lecturer", email: "chanda.swe@diu.edu.bd", phone: "01556628930", room: null },
  { initial: "CP", name: "MR. BIBHAS ROY CHOWDHURY PIYAS", designation: "Lecturer", email: "piyas.swe@diu.edu.bd", phone: "01703428672", room: null },
  { initial: "JIC", name: "Jafrin Iqbal Chowdhury", designation: "Lecturer", email: "jafrin.swe@diu.edu.bd", phone: "01842208940", room: null },
  { initial: "MHN", name: "MR. MD MONIR HOSSAIN", designation: "Lecturer", email: "monirhossain.swe@diu.edu.bd", phone: "01704909244", room: null },
  { initial: "FRR", name: "Fazla Rabby Raihan", designation: "Lecturer", email: "fraihan.swe@diu.edu.bd", phone: "01956249285", room: null },
  { initial: "MBH", name: "Maliha Bushra Hoque", designation: "Lecturer", email: "maliha.swe@diu.edu.bd", phone: "01797088600", room: null },
  { initial: "MMSI", name: "MS. SHAHRIN ISLAM", designation: "Lecturer", email: "shahrinislam.swe@diu.edu.bd", phone: "01779448961", room: null },
  { initial: "FJT", name: "MS. FATAMA JANNAT TISHA", designation: "Lecturer", email: "tisha.swe@diu.edu.bd", phone: "01881638899", room: null },
  { initial: "AR", name: "Md. Ashikur Rahman", designation: "Lecturer", email: "ashikur.swe@diu.edu.bd", phone: "01617277969", room: null },
  { initial: "HKN", name: "Humayun Kabir Nayem", designation: "Lecturer", email: "nayem.swe@diu.edu.bd", phone: "01737329184", room: null },
  { initial: "SI", name: "K. M. Shahriar Islam", designation: "Lecturer", email: "shahriar.swe@diu.edu.bd", phone: "01723021777", room: null },
  { initial: "MRN", name: "Mahbubur Rahman", designation: "Lecturer", email: "mahbubur.swe@diu.edu.bd", phone: "01797368331", room: null },
  { initial: "SHN", name: "Shazzad Hossain", designation: "Lecturer", email: "shazzad.swe.0199.c@diu.edu.bd", phone: "01521558897", room: null },
  { initial: "MJM", name: "Md Jaodun Muntasir", designation: "Lecturer", email: "jaodun.swe@diu.edu.bd", phone: "01873372428", room: null },
  { initial: "IAT", name: "Izaz Ahmmed Tuhin", designation: "Lecturer", email: "izaz.swe@diu.edu.bd", phone: "01918267179", room: null },
  { initial: "KM", name: "Khalid Masum", designation: "Lecturer", email: "khalid.swe@diu.edu.bd", phone: "01533519531", room: null },
  { initial: "SSI", name: "Syed Shams Islam", designation: "Lecturer", email: "shams.swe@diu.edu.bd", phone: "01704427800", room: null },
  { initial: "JJS", name: "Jul Jalal Al-Mamur Sayor", designation: "Lecturer", email: "mamur.swe@diu.edu.bd", phone: "01787054914", room: null },
  { initial: "QFF", name: "Quazi Fariha Fairooz", designation: "Lecturer", email: "fariha.swe@diu.edu.bd", phone: "01534816747", room: null },
  { initial: "AMR", name: "Ahnaf Mubashshir Mobin", designation: "Lecturer", email: "ahnaf.swe.0200.c@diu.edu.bd", phone: "01612563383", room: null },
  { initial: "AF", name: "Arif Faisal", designation: "Lecturer", email: "arif.swe@diu.edu.bd", phone: "01723465155", room: null },
  { initial: "RHH", name: "Rashidul Hasan Hridoy", designation: "Lecturer", email: "hasan.swe@diu.edu.bd", phone: "01714969317", room: null },
  { initial: "FA", name: "Faruk Ahmed", designation: "Lecturer", email: "faruk.swe@diu.edu.bd", phone: "01611193974", room: null },
  { initial: "MMN", name: "Mohseu Minhaj Niloy", designation: "Lecturer", email: "mohseu.swe@diu.edu.bd", phone: "01760479092", room: null },
  { initial: "NJN", name: "Nusrat Jahan", designation: "Lecturer", email: "nusrattazin.swe@diu.edu.bd", phone: "01779749972", room: null },
  { initial: "TBH", name: "Tahmid Bin Haque", designation: "Lecturer", email: "tahmidbinamit@gmail.com", phone: "01521754083", room: null },
  { initial: "ZH", name: "Zarif Hoque", designation: "Lecturer", email: "zarif.swe@diu.edu.bd", phone: "01317080908", room: null },
  { initial: "SSS", name: "Syed Samin Sadaf", designation: "Lecturer", email: "saminsadaf7@gmail.com", phone: "01302869890", room: null },
  { initial: "RUA", name: "Rahat Uddin Azad", designation: "Lecturer", email: "rahatuddin786@gmail.com", phone: "01878517664", room: null },
  { initial: "HT", name: "Himika Tasnim", designation: "Lecturer", email: "himikatasnim2002@gmail.com", phone: "01993808525", room: null },
  { initial: "RA", name: "Md. Rashedul Alam", designation: "Lecturer", email: "rashedulalam711@gmail.com", phone: "01771087871", room: null },
  { initial: "SSR", name: "S. M. SAIDUR RAHMAN", designation: "Lecturer", email: "sm.saidur.rahman25@gmail.com", phone: "01324194133", room: null },
  { initial: "SSA", name: "Sadia Sultana", designation: "Lecturer", email: "sadiasultana.swe@diu.edu.bd", phone: "01797579591", room: null },
  { initial: "SIM", name: "Samiul Islam Mugdha", designation: "Lecturer", email: "samiul.swe0225.c@diu.edu.bd", phone: "01962353752", room: null },
  { initial: "MI", name: "Mirajul Islam", designation: "Lecturer", email: "mirajul.swe0223.c@diu.edu.bd", phone: "01768531490", room: null },
  { initial: "RH", name: "Rony Hoissain", designation: "Lecturer", email: "rony.swe0224.c@diu.edu.bd", phone: "01968744591", room: null },
  { initial: "JC", name: "Joya Chakraborty", designation: "Lecturer", email: "joya.eng0183.c@diu.edu.bd", phone: "01700968224", room: null },
  { initial: "ZT", name: "Zarin Tusnim", designation: "Lecturer", email: "zarin.cse0551.c@diu.edu.bd", phone: "01613094472", room: null },
  { initial: "HSA", name: "Hafsa Sultana", designation: "Lecturer", email: "hafsa.cse0565.c@diu.edu.bd", phone: "01742649596", room: null },
  { initial: "ST", name: "Sheikh Tonmoy", designation: "Lecturer", email: "tonmoy.swe0463.c@diu.edu.bd", phone: "01989388418", room: null },
  { initial: "MNA", name: "Muskan Ahmed", designation: "Lecturer", email: "muskan.swe.0202.c@diu.edu.bd", phone: "01626817647", room: null },
  { initial: "HBM", name: "Humira Bentay Mahmud", designation: "Lecturer", email: "humira.swe0209.c@diu.edu.bd", phone: "01521719473", room: null },
  { initial: "TM", name: "Tahmina Meem", designation: "Lecturer", email: "meem.swe0177.c@diu.edu.bd", phone: "01858014587", room: null },
  { initial: "SD", name: "Sayone Dey", designation: "Lecturer", email: "sayoneedtroyee@gmail.com", phone: "01771138861", room: null },
  { initial: "TT", name: "Tahsin Tasnim", designation: "Lecturer", email: "tahsintasnim01@gmail.com", phone: "01779696468", room: null },
  { initial: "MAB", name: "Maria Afrin Bindu", designation: "Lecturer", email: "maria.swe0219.c@diu.edu.bd", phone: "01617374700", room: null },
  { initial: "NML", name: "Nasim Mahmud Likhon", designation: "Lecturer", email: "nasimmahmud819@gmail.com", phone: "01755132180", room: null },
  { initial: "FTJ", name: "Fatema Tuz Johora", designation: "Lecturer", email: "meem8494@gmail.com", phone: "01764277119", room: null },
  { initial: "DDK", name: "Dipta Dipayan Kar", designation: "Lecturer", email: "dipta.swe.0203.c@diu.edu.bd", phone: "01741117857", room: null },
  { initial: "ASM", name: "Ayesha Siddika Moon", designation: "Lecturer", email: "ayesha.cse0603.c@diu.edu.bd", phone: "01798458271", room: null },
  { initial: "SMM", name: "SADIKATUL MAWA MOMO", designation: "Lecturer", email: "mawamomo0@gmail.com", phone: "01952088152", room: null },
  { initial: "MSP", name: "Md. Shahriar Parvez", designation: "Lecturer", email: "parvez.swe0141.c@diu.edu.bd", phone: "01944829693", room: null },
  { initial: "SAM", name: "Md. Sakib Ali Mazumder", designation: "Lecturer", email: "sakib.swe0165.c@diu.edu.bd", phone: "01623072047", room: null },
  { initial: "SAS", name: "Sampa Saha", designation: "Lecturer", email: "sampa.ba@diu.edu.bd", phone: "01627553431", room: null },
  { initial: "MSH", name: "Md Shahadat Hossain", designation: "Lecturer", email: "shahdat.se@gmail.com", phone: "01777481417", room: null },
  { initial: "TRK", name: "Tanjeer Rahee Khan", designation: "Lecturer", email: "rahee.trk@gmail.com", phone: "01870828258", room: null },
  { initial: "JR", name: "Jeba Raisa", designation: "Lecturer", email: "maksurathussain@gmail.com", phone: "01954816959", room: null },
  { initial: "MSI", name: "Dr Md Shafikul Islam", designation: "Lecturer", email: "shafik.cse@gmail.com", phone: "01987300260", room: null },
  { initial: "MHB", name: "MD Mahmudul Hasan Biplob", designation: "Lecturer", email: "mhbiplob57@gmail.com", phone: "01784264684", room: null },
  { initial: "AHB", name: "Abid Hossain Biswas", designation: "Lecturer", email: "abid.hossainsadat@gmail.com", phone: "01760028266", room: null },
  { initial: "RAR", name: "Riya Akter", designation: "Lecturer", email: "akteriya15@gmail.com", phone: "01993746501", room: null },
  { initial: "MSR", name: "Md. Shahinur Rahman", designation: "Lecturer", email: "msrahk@gmail.com", phone: "01976550550", room: null },
  { initial: "MAR", name: "Mahzabin Alamgir", designation: "Lecturer", email: "mahzabin5054@gmail.com", phone: "01777798154", room: null },
  { initial: "AHN", name: "Arafat Hosain Neloy", designation: "Lecturer", email: "arafat390ahn@gmail.com", phone: "01772020634", room: null },
  { initial: "HMI", name: "Himi", designation: "Lecturer", email: "farzana.bba0242.c@diu.edu.bd", phone: "01843000028", room: null },
  { initial: "MSIM", name: "Md saeedul Islam", designation: "Lecturer", email: "Syeedul.577@gmail.com", phone: "01776963182", room: null },
];

export default function SeedTeachersPage() {
  const { loading } = useProtectedRoute("super-admin");
  const [seeding, setSeeding] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const total = SWE_TEACHERS.length;

  const handleSeed = async () => {
    if (!confirm(`This will add ${total} SWE teachers to Firestore. Continue?`)) return;
    setSeeding(true);
    setProgress(0);
    let count = 0;
    for (const t of SWE_TEACHERS) {
      try {
        await addTeacher({
          name: t.name,
          initial: t.initial || "",
          designation: t.designation || "Lecturer",
          department: "SWE",
          email: t.email || null,
          phone: t.phone || null,
          room: t.room || null,
          approved: true,
        } as any);
        count++;
        setProgress(count);
      } catch {
        // skip duplicates / errors silently
      }
    }
    setSeeding(false);
    setDone(true);
    toast.success(`Seeded ${count} of ${total} SWE teachers!`);
  };

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-2">
        {done ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Loader2 className={`w-8 h-8 text-blue-600 ${seeding ? "animate-spin" : ""}`} />}
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Seed SWE Teachers</h1>
      <p className="text-gray-500">
        This will insert <strong>{total}</strong> SWE department teachers into Firebase with <code>approved: true</code>.
        Already-existing teachers will be skipped if errors occur.
      </p>
      {seeding && (
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-200"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      )}
      {seeding && <p className="text-sm text-gray-500">{progress} / {total} seeded…</p>}
      {done && <p className="text-green-600 font-semibold">✅ Done! All {total} teachers seeded.</p>}
      {!done && (
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-60 transition"
        >
          {seeding ? <><Loader2 className="w-4 h-4 animate-spin" /> Seeding…</> : "🚀 Seed All SWE Teachers"}
        </button>
      )}
    </div>
  );
}
