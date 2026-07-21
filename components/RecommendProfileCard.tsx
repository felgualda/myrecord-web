
interface RecommendProfileCardProps {
    username: string;
    nickname: string;
    pfp_url: string;
    records_today: number;

}
export default function RecommendedProfileCard({username, nickname, pfp_url, records_today} : RecommendProfileCardProps) {

    return(
        <div className="py-2">
            <div className="w-full h-[80px] bg-background-light rounded-2xl hover:bg-background-light/70 transition-colors">
                <div className="py-4 flex items-center ">
                    <div className="px-4 cursor-pointer">
                        <img 
                        src={pfp_url || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} 
                        alt="Foto de perfil" 
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shrink-0"
                        />
                    </div>

                    <div className="flex flex-col cursor-pointer">
                        <div className="text-text-main font-bold leading-none">
                            {nickname}
                        </div>
                        <div className="text-text-muted text-sm leading-tight mt-1">
                            {`@${username}`}
                        </div>
                    </div>

                    <div className="ml-auto pr-4 flex flex-col items-center">
                        <span className="text-md font-black text-white leading-none">
                            {records_today}
                        </span>
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                            Records hoje
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}