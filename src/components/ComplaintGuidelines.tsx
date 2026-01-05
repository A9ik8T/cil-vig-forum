const ComplaintGuidelines = () => {
  const guidelines = [
    "Complaint can be lodged only against employees belonging to the Coal India Limited, Kolkata and its subsidiaries.",
    "While complaints against tenders may be investigated, it could not interfere in the tender process.",
    "Complaints must be brief and contain factual details, verifiable facts and related matters. They should not be vague or contain sweeping general allegations.",
    "The complaint having vigilance angle shall only be examined. The vigilance angle comprises of misuse of official position, demand and acceptance of illegal gratification, cases of misappropriation / forgery or cheating, gross and willful negligence, blatant violation of laid down systems and procedures, reckless exercise of discretion, delay in processing the cases, etc.",
    "The complaint having other than vigilance angle will be either be filed or will be referred to the concerned department of CIL and it subsidiaries."
  ];

  return (
    <div className="p-4 px-6" style={{ backgroundColor: '#d1d1d1' }}>
      <p className="text-xs mb-4" style={{ color: '#333' }}>
        Complaints regarding irregularities in CIL and it subsidiaries corruption and bungling of money involvement of Employees of CIL and it subsidiaries
      </p>
      <ul className="list-disc list-outside ml-6 space-y-2">
        {guidelines.map((guideline, index) => (
          <li key={index} className="text-xs leading-relaxed" style={{ color: '#333' }}>
            {guideline}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintGuidelines;
