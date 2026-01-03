
"use client";

import PageHeader from "@/components/PageHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Info, Share2, HandHelping, Copy, BookOpen, Brain, Shield, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const duas = [
    {
        title: "دعاء تفريج الهم",
        icon: <Shield className="w-6 h-6 text-destructive" />,
        content: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ.",
        color: "destructive"
    },
    {
        title: "دعاء الاستخارة",
        icon: <Brain className="w-6 h-6 text-blue-500" />,
        content: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلا أَقْدِرُ، وَتَعْلَمُ وَلا أَعْلَمُ، وَأَنْتَ عَلامُ الْغُيُوبِ...",
        color: "blue"
    },
    {
        title: "دعاء سيد الاستغفار",
        icon: <Heart className="w-6 h-6 text-accent" />,
        content: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        color: "accent"
    },
    {
        title: "دعاء الرزق",
        icon: <Briefcase className="w-6 h-6 text-secondary" />,
        content: "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ.",
        color: "secondary"
    }
];


export default function DuaPage() {
  const { toast } = useToast();

  const handleCopy = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم نسخ الدعاء",
      description: title,
    });
  };

  return (
    <div>
      <PageHeader title="الدعاء" description="أبواب السماء مفتوحة" />
      <div className="space-y-6 p-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 shadow-lg">
            <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <HandHelping className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-3 text-primary">دعاء للوالد</h2>
                <p className="text-lg leading-loose font-medium text-foreground/90">
                    اللهم اغفر لوالدي محمد سعيد عبدالله الاشولي، وارفع درجته في المهديين، واخلفه في عقبه في الغابرين، واغفر لنا وله يا رب العالمين، وافسح له في قبره ونور له فيه.
                </p>
            </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full pt-4">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-accent"/>
                    <span>النية</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed pt-2 pr-4 border-r-2 border-accent mr-2">
              هذا التطبيق صدقة جارية عن روح والدي محمد سعيد عبدالله الاشولي رحمه الله. أسأل الله أن يتقبله بقبول حسن وأن يجعله في ميزان حسناته، وأن ينفع به كل من استخدمه.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-center text-primary/80">أدعية من القرآن والسنة</h2>
            {duas.map((dua, index) => (
                <Card key={index} className={`border-${dua.color}/20 bg-${dua.color}/5 shadow-md`}>
                    <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 bg-${dua.color}/10 rounded-full`}>
                                {dua.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold text-${dua.color}`}>{dua.title}</h3>
                                <p className="text-base leading-relaxed text-foreground/80 mt-2">{dua.content}</p>
                            </div>
                        </div>
                         <div className="flex justify-end mt-3">
                            <Button variant="ghost" size="sm" onClick={() => handleCopy(dua.content, dua.title)}>
                                <Copy className="w-4 h-4 ml-2" />
                                نسخ
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">
                <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-secondary"/>
                    <span>نبذة عن التطبيق</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed pt-2 pr-4 border-r-2 border-secondary mr-2">
              تطبيق "سعيد" هو مشروع خيري غير ربحي، تم إنشاؤه كصدقة جارية عن الوالد المتوفى -بإذن الله-. يهدف التطبيق إلى توفير محتوى إسلامي نافع وسهل الوصول، ليكون رفيقًا للمسلم في يومه وليلته. نرجو منكم الدعاء له بالرحمة والمغفرة.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">
                 <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-destructive"/>
                    <span>مشاركة التطبيق</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed pt-2 pr-4 border-r-2 border-destructive mr-2">
              ساهم في نشر الخير وشارك التطبيق مع أصدقائك وعائلتك. فالدال على الخير كفاعله.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
