const TeamMember = ({ name, role, children }: {name: string, role: string}) => {
    return (<p>
        <b>{name} - {role}</b> : {children}
    </p>)
}
export default function Page() {
    return (
        <div className="max-w-prose mx-auto pt-5">
            <p>‘Nivarana’, refers to ‘removing distress’.</p>
            <p>In Buddhism, ‘Nivarana’ refers to obstacles that blind our mental vision – sensual desires, ill-will, slothfulness, restlessness, doubts, and ignorance. One must overcome these obstacles to attain nirvana. Nivarana was also the name of a Bodhisattva (a person on the path to Buddhahood) representing the encyclopedia of knowledge – the Bodhisattva of wisdom.</p>
            <p>Started in July 2022, Nivarana aims to address the barrier of ignorance. India currently lacks a dedicated and reliable source of public health-related information. Nivarana is the first and only website dedicated to matters concerning India’s public health. We aim to engage the public with public health through extensively researched yet simple-to-understand articles, and online awareness sessions and forum discussions.</p>
            <p>Our mission is to amplify the voices of marginalized and underprivileged communities by raising awareness of their heath related challenges and fostering empathy among those in positions of power, ultimately inspiring collective action for a more just and equitable society.</p>
            <p>Our vision is to turn India into a nation where every individual, regardless of their background, has equal access to opportunities, rights, and resources to maintain good health, driven by a compassionate society that advocates for justice and inclusivity for all.</p>
            <h3>About the Team</h3>
            <TeamMember name="Parth Sharma" role="Founder and Lead Editor">
                Parth is a physician, researcher, and writer. He graduated from Christian Medical College, Vellore in 2020 and is currently doing his MD in Preventive and Social Medicine in Maulana Azad Medical College, Delhi, India. Having witnessed a lot of suffering during his clinical practice in the Departments of Medical Oncology and Emergency Medicine, he wants to work to improve not just people’s quality of life but also their quality of death. He is interested in preventive and supportive oncology and wants to work to improve the accessibility and affordability of cancer care in India.
            </TeamMember>
            <TeamMember name="Christianez Ratna Kiruba" role="Deputy Editor">
                Christianez is an internal medicine physician and a freelance health journalist. She is a post graduate from Christian Medical College, Vellore. Being a intersectional feminist and a part of the LGBTQIA community, she is interested in looking at disparities in healthcare access and delivery through the lens of gender. Her aim is to tell stories that can bring new perspectives, amplify the voices of the underprivileged and drive policy level changes.
            </TeamMember>
            <TeamMember name="Divya Shrinivas" role="Managing Editor">
                Divya Shrinivas is an MBBS intern at Government Medical College, Ambajogai. Her interests are varied from being a coordinator at an NGO which makes help accessible for people suffering from substance use disorders to making education accessible to underprivileged kids. She is passionate about women and child health and is an aspiring pediatrician with the hope of making quality healthcare accessible to all children.
                In her free time, she enjoys reading, petting stray animals, and watching wildlife documentaries.
            </TeamMember>
            <TeamMember name="Radhikaa Sharma" role="Associate Editor">
                Radhikaa is a 2019 MBBS graduate from Assam Medical College, who wishes to learn about and generate interest in public health. She has worked as a medical officer for the National Health Mission, where she saw the benefits of primary and preventive healthcare firsthand. In her free time, Radhikaa can be found reading fiction, non-fiction, and open-access journals.
            </TeamMember>
            <TeamMember name="Royson Dsouza" role="Writer">
                Royson is a general surgeon with a special interest in global and rural surgery. He completed his MS in General Surgery from Christian Medical College Vellore in 2020. He then worked in Gudalur Adivasi Hospital, an organization striving for the health and welfare of the tribals in the Nilgiris.
                He is currently pursuing a fellowship in Colorectal Surgery at Christian Medical College, Vellore. He has several publications focusing on rural health care. Besides surgery he loves his family, playing basketball, trekking, biking, and cooking.
            </TeamMember>
            <TeamMember name="Janvi Bokoliya" role="Content Designer">
                Janvi is a student in her pre-final year of MBBS at Maulana Azad Medical College. She has a strong interest in public health and social issues and enjoys reading fiction, doing calligraphy, and watching documentaries in their free time. She is poised to make a meaningful contribution to society in the future.
            </TeamMember>
            <TeamMember name="Gayatri Sharma" role="Illustrator">
                Gayatri is a public health worker with a background in Emergency Medicine. She is committed to demystifying, decentralizing and democratizing health using illustration to transcend language barriers and amplifying the perspectives of the unheard and underprivileged. Her illustrations attempt to bring critical issues to public consciousness, hoping to empower communities to take agency over their health.
            </TeamMember>
            <TeamMember name="Deekshith Vodela" role="Social Media Manager">
                Deekshith is a 2nd year MBBS student at Kakatiya Medical College, Warangal. He is interested in genetics and is an aspiring researcher with core interest in finding causes for idiopathic diseases. He is skilled in social media management and video editing. During his free time, he enjoys watching anime and Formula 1.
            </TeamMember>
            <TeamMember name="Akshay S Dinesh" role="Technical Editor">
                Akshay S Dinesh is a generalist straddling public health and technology for a progressive society. Read more <a href="https://asd.learnlearn.in/about/">here</a>.
            </TeamMember>
            <h3>Our Advisors:</h3>

            <p><b>Siddhesh Zadey -</b> Researcher and Writer, Co-founder ASAR. Duke University, North Carolina, USA.</p>
            <p><b>Dr Swathi Krishna N -</b> Public Health Physician, Health Policy and Systems Researcher, Assistant Professor in Community Medicine, Bharati Vidyapeeth Medical College, Pune, Maharashtra, India.</p>
            <h4>Past Advisors:</h4>
            <p><b>Dr Sonali Vaid -</b> Global Health Specialist, Founder Incluve Labs, Alumnus Harvard T.H. Chan School of Public Health</p>
            <p><b>Dr Pranab Chatterjee -</b> Epidemiologist and Writer. Johns Hopkins University, Baltimore, USA.</p>
            <p><b>Dr Sunil Chandy -</b> Former Director, Christian Medical College, Vellore.</p>
            <p><b>Dr Purnima Menon -</b> Senior Director for Food and Nutrition Policy, CGIAR; Senior Research Fellow, IFPRI, New Delhi, India.</p>
            <p><b>Patralekha Chatterjee -</b> Journalist, Public Policy Analyst. Visiting Fellow, Global Health Justice Partnership, Yale.</p>
            <p><b>Dr Gagandeep Kang -</b> Director, Division of Global Health, Bill and Melinda Gates Foundation, USA.</p>
            <p><b>Dr Cyriac Abby Philips -</b> Clinician-Scientist, The Liver Institute, Center of Excellence in GI Sciences, Rajagiri Hospital, Aluva, Kerala, India.</p>
        </div>
    )
}